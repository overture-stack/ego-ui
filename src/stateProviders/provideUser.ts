import { provideState } from 'freactal';

export default provideState({
  initialState: () => ({
    user: null,
  }),
  effects: {
    setUser: (effects, user) => state => ({ state, user }),
  },
});
