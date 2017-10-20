import { provideState } from 'freactal';
import { setToken } from 'services/ajax';

export default provideState({
  initialState: () => ({
    user: null,
    token: '',
  }),
  effects: {
    setUser: (effects, user) => state => ({ ...state, user }),
    setToken: (effects, token) => state => {
      setToken(token);
      return { ...state, token };
    },
  },
});
