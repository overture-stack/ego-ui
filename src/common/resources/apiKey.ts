import { ApiKey } from 'common/typedefs/ApiKey';
import { IListParams, IListResponse } from 'common/typedefs/Resource';
import { revokeApiKey, getApiKeys } from 'services';

interface ApiKeyResourceInterface {
  deleteItem: (item: ApiKey) => Promise<string>;
  getList: (params: IListParams) => Promise<IListResponse>;
  // getChildList: (
  //   resourceType: string,
  //   childResourceType: string,
  //   id: string,
  // ) => Promise<IListResponse>;
}
const ApiKeyResource: ApiKeyResourceInterface = {
  deleteItem: (item) => revokeApiKey(item),
  getList: getApiKeys,
  // TODO: correct function
  // getChildList: getApiKeys,
};

export default ApiKeyResource;
// TO REMOVE
// name: { singular: 'API Key', plural: API_KEYS },
// rowHeight: 44,
// isParent: false,
// ListItem: ApiKeyListItem,
// getName: (item) => get(item, 'name'),
// Icon: () => null,
// getKey: (item) => item.name,
// emptyMessage: '',
// addItem: false,
// associatedTypes: [],
// AssociatorComponent: ApiKeysTable,
