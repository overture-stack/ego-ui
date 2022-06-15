import { Application } from 'common/typedefs/Application';
import { Group } from 'common/typedefs/Group';
import { User } from 'common/typedefs/User';
import { Permission } from './Permission';
import { Policy } from './Policy';

export type Entity = User | Group | Application | Policy | Permission;

export * from './User';
export * from './Group';
export * from './Application';
export * from './Policy';
