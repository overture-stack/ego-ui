import { provideState } from 'freactal';
import { setToken as setAjaxToken } from 'services/ajax';

export default provideState({
  initialState: () => ({
    loggedInUser: null,
    loggedInUserToken: '',
    preferences: {},
  }),

  effects: {
    initialize: (effects, preferences) => state => {
      let loggedInUserToken = '';
      const user = localStorage.getItem('user-token') || false;
      if(user) {
        setAjaxToken(user);
        loggedInUserToken= user;
      }
      return {...state, loggedInUserToken}
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

    setToken: (effects, token) => state => {
      setAjaxToken(token);
      return { ...state, loggedInUserToken: token };
    },
  },
});
