import { Application } from 'common/typedefs/Application';
import { Group } from 'common/typedefs/Group';
import { User } from 'common/typedefs/User';
import { ApiKey } from './ApiKey';
import { Permission } from './Permission';
import { Policy } from './Policy';

export type Entity = User | Group | Application | Policy | Permission;

export * from './User.d';
export * from './Group.d';
export * from './Application.d';
export * from './Policy.d';
