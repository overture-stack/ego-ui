import * as React from 'react';
import { setToken as setAjaxToken } from 'services/ajax';
import path from 'ramda/src/path';

export const UserContext = React.createContext({
  loggedInUser: null,
  loggedInUserToken: '',
  preferences: {},
  setLoggedInUser: (_user: any) => {
    // emtpy
  },
  setToken: (_token: string) => {
    // emtpy
  },
  setUserPreferences: (_p: any) => {
    // emtpy
  },
});

export function UserProvider(props: { children: React.ReactNode }) {
  const [user, setUser] = React.useState({
    loggedInUser: null,
    loggedInUserToken: '',
    preferences: {},
  });

  const setToken = (token: string) => {
    setAjaxToken(token);
    setUser(prevState => ({ ...prevState, loggedInUserToken: token }));
  };

  const setUserPreferences = (p: any) => {
    if (!user) {
      return;
    }
    const preferences = { ...user.preferences, ...p };
    setUser(prevState => ({ ...prevState, preferences }));
    localStorage.setItem(
      `user-preferences-${path(['loggedInUser, id'], user)}`,
      JSON.stringify(preferences),
    );
  };

  const setLoggedInUser = (u: any) => {
    setUser(prevState => ({ ...prevState, loggedInUser: u }));
    setUserPreferences(
      JSON.parse(localStorage.getItem(`user-preferences-${path(['id'], user)}`) || '{}'),
    );
  };

  return (
    <UserContext.Provider value={{ ...user, setLoggedInUser, setToken, setUserPreferences }}>
      {props.children}
    </UserContext.Provider>
  );
}
