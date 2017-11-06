import _ from 'lodash';
import { provideState } from 'freactal';
import RESOURCE_MAP from 'common/RESOURCE_MAP';

export default provideState({
  initialState: () => ({
    list: {
      resultSet: [],
      count: 0,
      params: {
        offset: 0,
        limit: 20,
        sortField: null,
        sortOrder: null,
        query: null,
      },
    },
  }),
  effects: {
    getState: () => state => ({ ...state }),
    updateListParams: (effects, params) => state => ({
      ...state,
      list: { ...state.list, params: { ...state.list.params, ...params } },
    }),

    setListType: (effects, type) => state => ({
      ...state,
      list: { ...state.list, type },
    }),

    refreshList: async effects => {
      const { list: { params, type } } = await effects.getState();
      const response = await RESOURCE_MAP[type].getList(params);
      return state => ({
        ...state,
        list: {
          ...state.list,
          ...response,
        },
      });
    },

    updateList: async (effects, params) => {
      const { list: { params: lastParams } } = await effects.getState();
      const { list: { params: newParams } } = await effects.updateListParams(params);
      if (!_.isEqual(lastParams, newParams)) {
        await effects.refreshList();
      }
      return state => ({ ...state });
    },
  },
});
