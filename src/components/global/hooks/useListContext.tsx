import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { ResourceType } from 'common/typedefs/Resource';
import RESOURCE_MAP from 'common/RESOURCE_MAP';
import schemas from 'common/schemas';

export enum SortOrder {
  DESC = 'DESC',
  ASC = 'ASC',
}

interface ListParams {
  offset: number;
  limit: number;
  sortField: { key: string; fieldName: string };
  sortOrder: SortOrder;
  query: string;
}

interface List {
  resultSet: ResourceType[];
  count: number;
}

// type RefreshList = (
//   resource: IResource,
//   parent: { resource: IResource; id: string },
//   optParams: Partial<ListParams>,
// ) => Promise<List>;

// type T_ListContext = {
//   list: List;
//   updateList: (
//     resource: IResource,
//     parent: { id: string; resource: IResource },
//     optParams?: Partial<ListParams>,
//   ) => void;
//   listParams: ListParams;
//   setListParams: (params: Partial<ListParams>) => void;
// };

const initialSortField = { key: 'id', fieldName: 'ID' };
const initialParams: any = {
  offset: 0,
  limit: 20,
  // TODO: add fieldNames enum
  sortField: initialSortField, // double check this can apply to all entity types
  sortOrder: SortOrder.ASC,
  query: '',
};

const initialListState = {
  resultSet: [],
  count: 0,
};

type T_ListContext = {
  list: List;
  listParams: ListParams;
  currentResource: ResourceType;
  setListParams: (params: Partial<ListParams>) => void;
};
const ListContext = createContext<T_ListContext>({
  list: initialListState,
  listParams: initialParams,
  currentResource: undefined,
  setListParams: () => {},
});

const getInitialSortField = (resource: ResourceType) => {
  if (resource) {
    const resourceSort = schemas[resource].find((s) => s.initialSort);
    return { key: resourceSort.key, fieldName: resourceSort.fieldName };
  }
  return initialSortField;
};
// export const getResourceParent = (
//   resourceName: ResourceType | 'create',
//   resourceId?: string,
//   subResourceName?: ResourceType | 'edit',
// ) => (subResourceName ? { resource: RESOURCE_MAP[resourceName], id: resourceId } : undefined);

// this ensures the correct resource type is used for api requests, depending on whether the list is for the parent or the child
// const getRelevantResource: (
//   childResourceName: ResourceType | 'edit',
//   parentResourceName: ResourceType | 'create',
// ) => IResource = (childResourceName, parentResourceName) => {
//   return childResourceName ? RESOURCE_MAP[childResourceName] : RESOURCE_MAP[parentResourceName];
// };

export const ListProvider = ({
  resourceName,
  children,
}: {
  resourceName: ResourceType;
  children: ReactNode;
}) => {
  // tracking resource and subresource changes because "parent" can be constructed based on their state
  // tracking just the resource type name as that can be used to access anything in the RESOURCE MAP
  // const [currentSubResourceName, setCurrentSubResourceName] = useState<ResourceType | 'edit'>(
  //   subResourceName,
  // );
  const [currentResource, setCurrentResource] = useState<ResourceType>(resourceName);
  const [currentListParams, setCurrentListParams] = useState<ListParams>({
    ...initialParams,
    sortField: getInitialSortField(resourceName),
  });
  const [listState, setListState] = useState<List>(initialListState);

  const setListParams = useCallback(
    (newParams: Partial<ListParams>) =>
      setCurrentListParams((params) => ({ ...params, ...newParams })),
    [],
  );

  useEffect(() => {
    if (resourceName) {
      setCurrentResource(resourceName);
      setCurrentListParams((current) => ({
        ...current,
        sortField: getInitialSortField(resourceName),
        // TODO: should changing resource reset the sortOrder to the default order (ASC)?
      }));
    }
  }, [resourceName]);

  useEffect(() => {
    const loadList = async () => {
      if (currentResource) {
        const getList = RESOURCE_MAP[currentResource].getList;
        // TODO: make sure correct schema is used here once child list context is introduced
        const validSortField = schemas[currentResource].find(
          (r) => r.key === currentListParams.sortField.key,
        )
          ? currentListParams.sortField
          : null;
        const newParams = {
          ...currentListParams,
          sortField: validSortField || getInitialSortField(currentResource),
        };
        // TODO: there's still 1 extra api request happening when the resource type changes, possibly because of params update. need to investigate
        // previously this useEffect was watching resourceType instead of currentResource, and that caused a second extra request with the old resource
        // if there is an existing search query, the first request will still have that query in the params.
        const data = await getList(newParams);
        setListState(data);
      }
    };
    loadList();
  }, [currentResource, currentListParams]);

  // const getListFunc = (associatedType, parent) => {
  //   return associatedType === ResourceType.PERMISSIONS && !isEmpty(parent)
  //     ? RESOURCE_MAP[associatedType].getList[parent.resource.name.plural]
  //     : RESOURCE_MAP[associatedType].getList;
  // };

  // const refreshList: RefreshList = async (resource, parent, optParams) => {
  //   const { sortOrder, sortField, query } = currentListParams;
  //   const combinedParams = {
  //     offset: 0,
  //     sortField: sortField.key,
  //     sortOrder,
  //     query,
  //     ...currentListParams,
  //     ...optParams,
  //     ...(optParams.sortField ? { sortField: optParams.sortField.key } : {}),
  //   };

  //   const match = (query || '').match(/^(.*)status:\s*("([^"]*)"|([^\s]+))(.*)$/);
  //   const [, before, , statusQuoted, statusUnquoted, after] = match || Array(5);
  //   const listFunc = resource
  //     ? getListFunc(resource.name.plural, parent)
  //     : () => Promise.resolve({});

  //   const response = await listFunc({
  //     ...combinedParams,
  //     ...(!isEmpty(parent) && { [`${parent.resource.name.singular}Id`]: parent.id, parent }),
  //     query:
  //       (match ? `${before || ''}${after || ''}` : combinedParams.query || '')
  //         .replace(/\s+/g, ' ')
  //         .trim() || null,
  //     status: statusQuoted || statusUnquoted || null,
  //   });

  //   return {
  //     ...listState,
  //     ...response,
  //   };
  // };

  // const updateList = async (resource, parent, optParams: Partial<ListParams> = {}) => {
  //   const data = await refreshList(resource, parent, optParams);
  //   setListState({
  //     ...listState,
  //     resultSet: data.resultSet,
  //     count: data.count,
  //   });
  // };

  // if (
  //   (resourceName && !currentResource) ||
  //   (currentResource && resourceName !== currentResource) ||
  //   subResourceName !== currentSubResourceName
  // ) {
  //   const newParent = getResourceParent(resourceName, resourceId, subResourceName);
  //   const resourceToUse = getRelevantResource(subResourceName, resourceName);
  //   // reset params when switching resource or subResource so initial sorting field is correct
  //   const newParams = getInitialParamsByResource(resourceToUse, newParent);
  //   setCurrentResource(resourceName);
  //   setCurrentSubResourceName(subResourceName);
  //   setCurrentListParams(newParams);
  //   updateList(resourceToUse, newParent, newParams);
  // }

  // const setListParams = (params: ListParams) => {
  //   if (!isEqual(params, currentListParams)) {
  //     setCurrentListParams({ ...currentListParams, ...params });
  //     updateList(
  //       getRelevantResource(subResourceName, currentResource),
  //       getResourceParent(currentResource, resourceId, currentSubResourceName),
  //       params,
  //     );
  //   }
  // };

  const listData = {
    list: listState,
    currentResource,
    listParams: currentListParams,
    setListParams,
  };

  return <ListContext.Provider value={listData}>{children}</ListContext.Provider>;
};

export default function useListContext() {
  return useContext(ListContext);
}