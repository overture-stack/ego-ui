import { Application } from 'common/typedefs/Application';
import { Group } from 'common/typedefs/Group';
import { User } from 'common/typedefs/User';

export type TEntity = User | Group | Application;

export * from './User.d';
export * from './Group.d';
export * from './Application.d';
