import React, { createContext, ReactNode, useContext, useState } from 'react';
import { isEmpty, get, isEqual } from 'lodash';
import { PERMISSIONS } from 'common/enums';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import { isChildOfPolicy } from 'common/associatedUtils';
import { IField, IResource, ResourceType, SortOrder } from 'common/typedefs/Resource';
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

type RefreshList = (
  resource: IResource,
  parent: { resource: IResource; id: string },
  optParams: Partial<ListParams>,
) => Promise<List>;

type T_ListContext = {
  list: List;
  updateList: (
    resource: IResource,
    parent: { id: string; resource: IResource },
    optParams?: Partial<ListParams>,
  ) => void;
  listParams: ListParams;
  setListParams: (params: Partial<ListParams>) => void;
};

const ListContext = createContext<T_ListContext>({
  list: undefined,
  updateList: () => {},
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
  resourceName: ResourceType | 'create',
  resourceId?: string,
  subResourceName?: ResourceType | 'edit',
) => (subResourceName ? { resource: RESOURCE_MAP[resourceName], id: resourceId } : undefined);

const getInitialParamsByResource = (
  resource: IResource,
  parent: { id: string; resource: IResource },
) => ({
  ...initialParams,
  ...{
    ...initialParams,
    sortField: resource
      ? resource.initialSortField(isChildOfPolicy(get(parent, 'resource')))
      : { key: 'id', fieldName: 'ID' },
    sortOrder: resource ? resource.initialSortOrder : 'ASC',
  },
});

// this ensures the correct resource type is used for api requests, depending on whether the list is for the parent or the child
const getRelevantResource: (
  childResourceName: ResourceType | 'edit',
  parentResourceName: ResourceType | 'create',
) => IResource = (childResourceName, parentResourceName) => {
  return childResourceName ? RESOURCE_MAP[childResourceName] : RESOURCE_MAP[parentResourceName];
};

export const ListProvider = ({
  resourceName,
  subResourceName,
  resourceId,
  children,
}: {
  resourceName: ResourceType | 'create';
  subResourceName?: ResourceType | 'edit';
  resourceId?: string;
  children: ReactNode;
}) => {
  // tracking resource and subresource changes because "parent" can be constructed based on their state
  // tracking just the resource type name as that can be used to access anything in the RESOURCE MAP
  const [currentResource, setCurrentResource] = useState<ResourceType | 'create'>(resourceName);
  const [currentSubResourceName, setCurrentSubResourceName] = useState<ResourceType | 'edit'>(
    subResourceName,
  );
  const [currentListParams, setCurrentListParams] = useState<ListParams>(
    getInitialParamsByResource(
      RESOURCE_MAP[resourceName],
      getResourceParent(resourceName, resourceId, subResourceName),
    ),
  );
  const [listState, setListState] = useState<List>(initialListState);

  const getListFunc = (associatedType, parent) => {
    return associatedType === PERMISSIONS && !isEmpty(parent)
      ? RESOURCE_MAP[associatedType].getList[parent.resource.name.plural]
      : RESOURCE_MAP[associatedType].getList;
  };

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
    (currentResource && resourceName !== currentResource) ||
    subResourceName !== currentSubResourceName
  ) {
    const newParent = getResourceParent(resourceName, resourceId, subResourceName);
    const resourceToUse = getRelevantResource(subResourceName, resourceName);
    // reset params when switching resource or subResource so initial sorting field is correct
    const newParams = getInitialParamsByResource(resourceToUse, newParent);
    setCurrentResource(resourceName);
    setCurrentSubResourceName(subResourceName);
    setCurrentListParams(newParams);
    updateList(resourceToUse, newParent, newParams);
  }

  const setListParams = (params: ListParams) => {
    if (!isEqual(params, currentListParams)) {
      setCurrentListParams({ ...currentListParams, ...params });
      updateList(
        getRelevantResource(subResourceName, currentResource),
        getResourceParent(currentResource, resourceId, currentSubResourceName),
        params,
      );
    }
  };

  const listData = {
    list: listState,
    updateList,
    listParams: currentListParams,
    setListParams,
  };

  return <ListContext.Provider value={listData}>{children}</ListContext.Provider>;
};

export default function useListContext() {
  return useContext(ListContext);
}
