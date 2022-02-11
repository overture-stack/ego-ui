import React, { createContext, ReactNode, useContext, useState } from 'react';
import { isEmpty, get, isEqual } from 'lodash';
import { PERMISSIONS } from 'common/enums';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import { isChildOfPolicy } from 'common/associatedUtils';
import { IField, IResource, SortOrder } from 'common/typedefs/Resource';
import { Entity } from 'common/typedefs';

interface ListParams {
  offset: number;
  limit: number;
  sortField: IField;
  sortOrder: SortOrder;
  query: string;
}

interface List {
  resultSet: Entity[];
  count: number;
}

type T_ListContext = {
  list: List;
  updateList: (
    resource: IResource,
    parent: { id: string; resource: IResource },
    optParams?: Partial<ListParams>,
  ) => void;
  setCurrentResource: (resource: IResource) => void;
  setCurrentParent: ({ resource: IResource, id: string }) => void;
  listParams: ListParams;
  setListParams: (params: Partial<ListParams>) => void;
};

const ListContext = createContext<T_ListContext>({
  list: undefined,
  updateList: () => {},
  setCurrentResource: () => {},
  setCurrentParent: () => {},
  listParams: undefined,
  setListParams: () => {},
});

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
};

export const getResourceParent = (
  resourceName: string,
  resourceId?: string,
  subResourceName?: string,
) => (subResourceName ? { resource: RESOURCE_MAP[resourceName], id: resourceId } : undefined);

export const ListProvider = ({
  resourceName,
  subResourceName,
  resourceId,
  children,
}: {
  resourceName: string;
  subResourceName?: string;
  resourceId?: string;
  children: ReactNode;
}) => {
  const [currentResource, setCurrentResource] = useState<IResource>(RESOURCE_MAP[resourceName]);
  const [currentParent, setCurrentParent] = useState<
    { resource: IResource; id: string } | undefined
  >(getResourceParent(resourceName, resourceId, subResourceName));
  const [currentSubResourceName, setCurrentSubResourceName] = useState<string>(subResourceName);
  const [currentListParams, setCurrentListParams] = useState<ListParams>({
    ...initialParams,
    ...{
      ...initialParams,
      sortField: currentResource
        ? currentResource.initialSortField(isChildOfPolicy(get(currentParent, 'resource')))
        : { key: 'id', fieldName: 'ID' },
      sortOrder: currentResource ? currentResource.initialSortOrder : 'ASC',
    },
  });
  const [listState, setListState] = useState<List>(initialListState);

  const getListFunc = (associatedType, parent) => {
    return associatedType === PERMISSIONS && !isEmpty(parent)
      ? RESOURCE_MAP[associatedType].getList[parent.resource.name.plural]
      : RESOURCE_MAP[associatedType].getList;
  };

  type RefreshList = (
    resource: IResource,
    parent: { resource: IResource; id: string },
    optParams: Partial<ListParams>,
  ) => Promise<List>;

  const refreshList: RefreshList = async (resource, parent, optParams) => {
    const { sortOrder, sortField, query } = currentListParams;
    const combinedParams = {
      offset: 0,
      sortField: sortField.key,
      sortOrder,
      query,
      ...currentListParams,
      ...optParams,
      ...(optParams.sortField ? { sortField: optParams.sortField.key } : {}),
    };

    const match = (query || '').match(/^(.*)status:\s*("([^"]*)"|([^\s]+))(.*)$/);
    const [, before, , statusQuoted, statusUnquoted, after] = match || Array(5);
    const listFunc = resource
      ? getListFunc(resource.name.plural, parent)
      : () => Promise.resolve({});

    const response = await listFunc({
      ...combinedParams,
      ...(!isEmpty(parent) && { [`${parent.resource.name.singular}Id`]: parent.id, parent }),
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

  const updateList = async (resource, parent, optParams: Partial<ListParams> = {}) => {
    const data = await refreshList(resource, parent, optParams);
    setListState({
      ...listState,
      resultSet: data.resultSet,
      count: data.count,
    });
  };

  if (
    (resourceName && !currentResource) ||
    (currentResource && resourceName !== currentResource.name.plural) ||
    subResourceName !== currentSubResourceName
  ) {
    const newResource = RESOURCE_MAP[resourceName];
    const newParent = getResourceParent(resourceName, resourceId, subResourceName);
    setCurrentResource(newResource);
    setCurrentParent(newParent);
    setCurrentSubResourceName(subResourceName);
    const resourceToUse = subResourceName ? RESOURCE_MAP[subResourceName] : newResource;
    updateList(resourceToUse, newParent, currentListParams);
  }

  const setListParams = (params: ListParams) => {
    if (!isEqual(params, currentListParams)) {
      setCurrentListParams({ ...currentListParams, ...params });
      updateList(currentResource, currentParent, params);
    }
  };

  const listData = {
    list: listState,
    updateList,
    setCurrentResource,
    setCurrentParent,
    listParams: currentListParams,
    setListParams,
  };

  return <ListContext.Provider value={listData}>{children}</ListContext.Provider>;
};

export default function useListContext() {
  return useContext(ListContext);
}
