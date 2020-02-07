import { provideState } from 'freactal';
import { isEqual } from 'lodash';

import { getListFunc } from './provideEntity';

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

    setListResource: (effects, resource, parent) => state => ({
      ...state,
      list: { ...state.list, resource, parent },
    }),

    refreshList: async effects => {
      const {
        list: { params, resource, parent },
      } = await effects.getState();
      const match = (params.query || '').match(/^(.*)status:\s*("([^"]*)"|([^\s]+))(.*)$/);
      const [, before, , statusQuoted, statusUnquoted, after] = match || Array(5);
      const listFunc = parent
        ? getListFunc(resource.name.plural, parent.resource)
        : resource.getList;

      const response = await listFunc({
        ...params,
        query:
          (match ? `${before || ''}${after || ''}` : params.query || '')
            .replace(/\s+/g, ' ')
            .trim() || null,
        status: statusQuoted || statusUnquoted || null,
      });

      return state => ({
        ...state,
        list: {
          ...state.list,
          ...response,
        },
      });
    },

    updateList: async (effects, params) => {
      const {
        list: { params: lastParams },
      } = await effects.getState();
      const {
        list: { params: newParams },
      } = await effects.updateListParams(params);
      if (!isEqual(lastParams, newParams)) {
        await effects.refreshList();
      }
      return state => ({ ...state });
    },
  },
});
