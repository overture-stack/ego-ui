import { ApiKey } from 'common/typedefs/ApiKey';
import { IListParams, IListResponse } from 'common/typedefs/Resource';
import { revokeApiKey, getApiKeys } from 'services';

interface ApiKeyResourceInterface {
  deleteItem: (item: ApiKey) => Promise<string>;
  getList: (params: IListParams) => Promise<IListResponse>;
}
const ApiKeyResource: ApiKeyResourceInterface = {
  deleteItem: (item) => revokeApiKey(item),
  getList: getApiKeys,
};

export default ApiKeyResource;
