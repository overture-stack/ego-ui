import { get, isEmpty } from 'lodash';

const getResourceName = resource => get(resource, 'name.singular');
const hasParent = parent => !isEmpty(parent);

const isChildOfPolicy = parent => hasParent(parent) && isPolicy(parent);
const isGroupPermission = (parent, child) =>
  hasParent(parent) && isGroup(parent) && isPermission(child);
const isUserPermission = (parent, child) =>
  hasParent(parent) && isUser(parent) && isPermission(child);

const isPolicy = resource => getResourceName(resource) === 'policy';
const isPermission = resource => getResourceName(resource) === 'permission';
const isUser = resource => getResourceName(resource) === 'user';
const isGroup = resource => getResourceName(resource) === 'group';
const isApiKey = resource => getResourceName(resource) === 'API Key';

export {
  isChildOfPolicy,
  isGroupPermission,
  isUserPermission,
  isApiKey,
  isPolicy,
  isPermission,
  isUser,
  isGroup,
  hasParent,
};
