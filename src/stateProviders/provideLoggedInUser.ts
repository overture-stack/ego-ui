import { provideState } from 'freactal';
import { setToken } from 'services/ajax';

export default provideState({
  initialState: () => ({
    loggedInUser: null,
    loggedInUserToken: '',
    preferences: {},
  }),
  effects: {
    setUserPreferences: (effects, preference) => state => {
      const preferences = { ...state.preferences, ...preference };

      localStorage.setItem(
        `user-preferences-${state.loggedInUser.id}`,
        JSON.stringify(preferences),
      );

      return { ...state, preferences };
    },

    setUser: (effects, loggedInUser) => state => {
      const preferences = JSON.parse(
        localStorage.getItem(`user-preferences-${loggedInUser.id}`) || '{}',
      );

      return { ...state, loggedInUser, preferences };
    },

    setToken: (effects, token) => state => {
      setToken(token);
      return { ...state, loggedInUserToken: token };
    },
  },
});
