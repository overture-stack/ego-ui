import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import jwtDecode from 'jwt-decode';
import { isEqual, has, isEmpty } from 'lodash';

import { setAjaxToken } from 'services/ajax';
import { isValidJwt } from '../utils/egoJwt';
import ajax from 'services/ajax';

type T_AuthContext = {
  token?: string;
  logout: () => void;
  user?: any;
  setToken: (token: string) => void;
  getUser: any;
  setUserPreferences: (preferences: any) => void;
  userPreferences: any;
};

const AuthContext = createContext<T_AuthContext>({
  token: undefined,
  logout: () => {},
  user: undefined,
  setToken: () => null,
  getUser: () => null,
  setUserPreferences: () => null,
  userPreferences: {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const initialJwt = localStorage.getItem('user-token');
  const [tokenState, setTokenState] = useState(initialJwt);
  // const [userState, setUserState] = useState(null);
  const [userPreferencesState, setUserPreferencesState] = useState({});

  const history = useHistory();

  const setToken = (jwt) => {
    localStorage.setItem('user-token', jwt);
    setTokenState(jwt);
    setAjaxToken(jwt);
  };

  const removeToken = () => {
    setToken(null);
    localStorage.removeItem('user-token');
  };

  const logout = () => {
    removeToken();
    history.push('/');
  };

  if (initialJwt && !has(ajax, 'defaults.headers.common.Authorization')) {
    setAjaxToken(initialJwt);
  }

  const getUser = (jwt: string) => {
    const jwtData = jwtDecode(jwt);
    return {
      ...jwtData.context.user,
      id: jwtData.sub,
    };
  };

  const setUserPreferences = (preferences) => {
    localStorage.setItem(`user-preferences-${user.id}`, JSON.stringify(preferences));
    setUserPreferencesState(preferences);
  };

  const user = tokenState ? getUser(tokenState) : null;
  if (user) {
    const storedPrefs = localStorage.getItem(`user-preferences-${user.id}`);
    if (!storedPrefs) {
      localStorage.setItem(`user-preferences-${user.id}`, JSON.stringify({}));
    } else {
      const parsedPrefs = JSON.parse(localStorage.getItem(`user-preferences-${user.id}`) || '{}');
      if (!isEqual(parsedPrefs, userPreferencesState)) {
        setUserPreferencesState(parsedPrefs);
      }
    }
  }

  const authData = {
    token: tokenState,
    logout,
    user,
    setToken,
    getUser,
    setUserPreferences,
    userPreferences: userPreferencesState,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
