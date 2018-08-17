import { User } from 'common/typedefs/User';
import { Group } from 'common/typedefs/Group';
import { Application } from 'common/typedefs/Application';
import { Acl } from 'common/typedefs/Acl';

export type TThing = User | Group | Application | Acl;

export * from './User.d';
export * from './Group.d';
export * from './Application.d';
export * from './Acl.d';
