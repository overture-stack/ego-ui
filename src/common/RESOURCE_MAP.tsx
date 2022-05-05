import { ResourceType } from 'common/enums';
import UserResource from './resources/user';
import GroupResource from './resources/group';
import ApplicationResource from './resources/application';
import ApiKeyResource from './resources/apiKey';
import PermissionResource from './resources/permission';
import PolicyResource from './resources/policy';

// ignore tslint sort, resources listed in deliberate order
const RESOURCE_MAP = {
  [ResourceType.USERS]: UserResource,
  [ResourceType.GROUPS]: GroupResource,
  [ResourceType.APPLICATIONS]: ApplicationResource,
  [ResourceType.API_KEYS]: ApiKeyResource,
  [ResourceType.PERMISSIONS]: PermissionResource,
  [ResourceType.POLICIES]: PolicyResource,
};

export default RESOURCE_MAP;
