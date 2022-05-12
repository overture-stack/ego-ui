import React, { createContext, ReactNode, useContext, useState } from 'react';
import { useHistory } from 'react-router';
import jwtDecode from 'jwt-decode';
import { isEqual, has } from 'lodash';

import { setAjaxToken } from 'services/ajax';
import { isValidJwt } from '../utils/egoJwt';
import ajax from 'services/ajax';
import { EGO_JWT_KEY, USER_PREFERENCES_PREFIX } from 'common/constants';

type T_AuthContext = {
  token?: string;
  logout: () => void;
  user?: any;
  getUser: any;
  setUserPreferences: (preferences: any) => void;
  userPreferences: any;
};

const AuthContext = createContext<T_AuthContext>({
  token: undefined,
  logout: () => {},
  user: undefined,
  getUser: () => null,
  setUserPreferences: () => null,
  userPreferences: {},
});

export const AuthProvider = ({
  children,
  initialJwt: egoJwt,
}: {
  children: ReactNode;
  initialJwt?: string;
}) => {
  const [userPreferencesState, setUserPreferencesState] = useState({});
  const history = useHistory();

  const logout = () => {
    localStorage.removeItem(EGO_JWT_KEY);
    history.push('/');
  };

  if (isValidJwt(egoJwt) && !has(ajax, 'defaults.headers.common.Authorization')) {
    setAjaxToken(egoJwt);
  }

  if (egoJwt && !isValidJwt(egoJwt)) {
    logout();
  }

  const getUser = (jwt: string) => {
    const jwtData = jwtDecode(jwt);
    return {
      ...jwtData.context.user,
      id: jwtData.sub,
    };
  };

  const setUserPreferences = (preferences) => {
    localStorage.setItem(`${USER_PREFERENCES_PREFIX}${user.id}`, JSON.stringify(preferences));
    setUserPreferencesState(preferences);
  };

  const user = egoJwt ? getUser(egoJwt) : undefined;
  if (user) {
    const storedPrefs = localStorage.getItem(`${USER_PREFERENCES_PREFIX}${user.id}`);
    if (!storedPrefs) {
      localStorage.setItem(`${USER_PREFERENCES_PREFIX}${user.id}`, JSON.stringify({}));
    } else {
      const parsedPrefs = JSON.parse(
        localStorage.getItem(`${USER_PREFERENCES_PREFIX}${user.id}`) || '{}',
      );
      if (!isEqual(parsedPrefs, userPreferencesState)) {
        setUserPreferencesState(parsedPrefs);
      }
    }
  }

  const authData = {
    token: egoJwt,
    logout,
    user,
    getUser,
    setUserPreferences,
    userPreferences: userPreferencesState,
  };

  return <AuthContext.Provider value={authData}>{children}</AuthContext.Provider>;
};

export default function useAuthContext() {
  return useContext(AuthContext);
}
