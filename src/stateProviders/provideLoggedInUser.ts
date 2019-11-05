import { provideState } from 'freactal';
import jwtDecode from 'jwt-decode';

import { setAjaxToken } from 'services/ajax';

export default provideState({
  initialState: () => ({
    loggedInUser: null,
    loggedInUserToken: '',
    preferences: {},
  }),

  effects: {
    initialize: (effects, preferences) => state => {
      let loggedInUserToken = '';
      let loggedInUser = {};

      const userToken = localStorage.getItem('user-token') || null;

      if (userToken) {
        const jwtData = jwtDecode(userToken);
        const user = {
          ...jwtData.context.user,
          id: jwtData.sub,
        };

        setAjaxToken(userToken);
        loggedInUserToken = userToken;
        loggedInUser = user;
      }

      return { ...state, loggedInUser, loggedInUserToken };
    },
    setUserPreferences: (effects, preference) => state => {
      const preferences = { ...state.preferences, ...preference };

      localStorage.setItem(
        `user-preferences-${state.loggedInUser.id}`,
        JSON.stringify(preferences),
      );

      return { ...state, preferences };
    },

    setUser: (effects, loggedInUser) => state => {
      const preferences = loggedInUser
        ? JSON.parse(localStorage.getItem(`user-preferences-${loggedInUser.id}`) || '{}')
        : {};

      return { ...state, loggedInUser, preferences };
    },

    // currently called only on login
    setToken: (effects, token) => state => {
      setAjaxToken(token);
      return { ...state, loggedInUserToken: token };
    },
  },
});
