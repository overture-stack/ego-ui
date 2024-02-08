export enum ResourceType {
  PERMISSIONS = 'permissions',
  USERS = 'users',
  GROUPS = 'groups',
  APPLICATIONS = 'applications',
  // currently used for title display on api key table, can be modified to 'apiKeys' when custom component is created with correct string
  API_KEYS = 'API Keys',
  POLICIES = 'policies',
}

// TODO: added this for now to make compiler happy
export enum SingularResourceType {
  PERMISSION = 'permission',
  USER = 'user',
  GROUP = 'group',
  APPLICATION = 'application',
  API_KEY = 'API Key',
  POLICY = 'policy',
}
