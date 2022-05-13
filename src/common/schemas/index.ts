import { ResourceType } from 'common/enums';
import { Schema } from './types';
import UserSchema from './users';
import GroupSchema from './groups';
import ApplicationSchema from './applications';
import PolicySchema from './policies';
import { ParentResource } from 'common/typedefs/Resource';

const schemas: { [k in ParentResource]: Schema } = {
  [ResourceType.USERS]: UserSchema,
  [ResourceType.GROUPS]: GroupSchema,
  [ResourceType.APPLICATIONS]: ApplicationSchema,
  [ResourceType.POLICIES]: PolicySchema,
};

export default schemas;
