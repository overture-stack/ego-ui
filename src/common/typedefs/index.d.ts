import { User } from 'common/typedefs/User';
import { Group } from 'common/typedefs/Group';
import { Application } from 'common/typedefs/Application';

export type TThing = User | Group | Application;

export * from './User.d';
export * from './Group.d';
export * from './Application.d';
