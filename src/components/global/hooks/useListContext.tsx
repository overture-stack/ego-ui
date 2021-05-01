import React, { createContext, ReactNode, useContext, useState } from 'react';
import { isEmpty, get } from 'lodash';
import { PERMISSIONS } from 'common/enums';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import { isChildOfPolicy } from 'common/associatedUtils';
import { useLocation } from 'react-router-dom';

// type T_EntityContext = {};
type T_ListContext = any;

//T_ListContext
const ListContext = createContext<T_ListContext>({});

const initialParams: any = {
  offset: 0,
  limit: 20,
  sortField: null,
  sortOrder: null,
  query: '',
};

const initialListState = {
  resultSet: [],
  count: 0,
  params: initialParams,
};

export const ListProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const path = location.pathname.split('/');
  const initialResource = RESOURCE_MAP[path[1]];
  const initialParent = RESOURCE_MAP[path[3]];
  const [listState, setListState] = useState({
    ...initialListState,
    params: {
      ...initialParams,
      sortField: initialResource
        ? initialResource.initialSortField(isChildOfPolicy(get(initialParent, 'resource')))
        : 'id',
      sortOrder: initialResource ? initialResource.initialSortOrder : 'ASC',
    },
  });

  const getListFunc = (associatedType, parent) => {
    return associatedType === PERMISSIONS && !isEmpty(parent)
      ? RESOURCE_MAP[associatedType].getList[parent.resource.name.plural]
      : RESOURCE_MAP[associatedType].getList;
  };

  const refreshList = async (resource, parent, optParams) => {
    const { sortOrder, sortField, query } = listState.params;
    const combinedParams = {
      offset: 0,

      sortField: sortField.key,
      // sortField: field.key,
      // sortOrder: order,
      sortOrder,
      query,
      ...optParams,
    };

    const match = (query || '').match(/^(.*)status:\s*("([^"]*)"|([^\s]+))(.*)$/);
    const [, before, , statusQuoted, statusUnquoted, after] = match || Array(5);

    const listFunc = resource
      ? getListFunc(resource.name.plural, parent)
      : () => Promise.resolve({});

    const response = await listFunc({
      ...combinedParams,
      ...(parent && { [`${parent.resource.name.singular}Id`]: parent.id, parent }),
      query:
        (match ? `${before || ''}${after || ''}` : combinedParams.query || '')
          .replace(/\s+/g, ' ')
          .trim() || null,
      status: statusQuoted || statusUnquoted || null,
    });

    return {
      ...listState,
      ...response,
    };
  };

  const updateList = async (resource, parent, optParams: any = {}) => {
    const data = await refreshList(resource, parent, optParams);
    setListState({
      ...listState,
      params: {
        ...listState.params,
        ...optParams,
      },
      resultSet: data.resultSet,
      count: data.count,
    });
  };

  const listData = {
    list: listState,
    updateList,
    setList: setListState,
    getListFunc,
  };

  return <ListContext.Provider value={listData}>{children}</ListContext.Provider>;
};

export default function useListContext() {
  return useContext(ListContext);
}
