import { get, isEmpty } from 'lodash';

import { API_KEY, GROUP, PERMISSION, POLICY, USER } from 'common/enums';

const getResourceName = resource => get(resource, 'name.singular');
const hasParent = parent => !isEmpty(parent);

const isChildOfPolicy = parent => hasParent(parent) && isPolicy(parent);
const isGroupPermission = (parent, child) =>
  hasParent(parent) && isGroup(parent) && isPermission(child);
const isUserPermission = (parent, child) =>
  hasParent(parent) && isUser(parent) && isPermission(child);

const isPolicy = resource => getResourceName(resource) === POLICY;
const isPermission = resource => getResourceName(resource) === PERMISSION;
const isUser = resource => getResourceName(resource) === USER;
const isGroup = resource => getResourceName(resource) === GROUP;
const isApiKey = resource => getResourceName(resource) === API_KEY;

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
