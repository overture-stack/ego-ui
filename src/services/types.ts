import { MaskLevel } from 'common/typedefs/Permission';
import { Application, Group, Policy, User } from '../common/typedefs';

type Entity = User | Group | Application | Policy;
export type UpdateEntity<T> = ({ item }: { item: T }) => Promise<T>;
export type DeleteEntity<T> = ({ item }: { item: T }) => Promise<string>;
export type CreateEntity<T> = ({ item }: { item: Partial<T> }) => Promise<T>;

export type AddToEntity<T> = ({
  entity,
  key,
  value,
}: {
  entity: T;
  key: string;
  value: string;
}) => Promise<T>;
export type RemoveFromEntity<T> = ({
  entity,
  key,
  value,
}: {
  entity: T;
  key: string;
  value: string;
}) => Promise<T>;

export type AddGroupToEntity<T> = ({ group, entity }: { group: Group; entity: T }) => Promise<T>;
export type AddApplicationToEntity<T> = ({
  application,
  entity,
}: {
  application: Application;
  entity: T;
}) => Promise<T>;

export type AddUserToEntity<T> = ({ user, entity }: { user: User; entity: T }) => Promise<T>;

export type RemoveGroupFromEntity<T> = ({
  group,
  entity,
}: {
  group: Group;
  entity: T;
}) => Promise<T>;
export type RemoveApplicationFromEntity<T> = ({
  application,
  entity,
}: {
  application: Application;
  entity: T;
}) => Promise<T>;
export type RemoveUserFromEntity<T> = ({ user, entity }: { user: User; entity: T }) => Promise<T>;

export interface GroupWithMask extends Group {
  mask: MaskLevel;
}

export interface UserWithMask extends User {
  mask: MaskLevel;
}

export interface PolicyWithMask extends Policy {
  mask: MaskLevel;
}

// TODO: mask should be passed in as its own argument for each of these add functions, for clarity
// it's possible it's set up this way because of the structure of staged changes, but if it can be refactored it should be
export type AddUserPermissionToPolicy = ({
  policy,
  user,
}: {
  policy: Policy;
  user: UserWithMask;
}) => Promise<Policy>;

export type AddGroupPermissionToPolicy = ({
  policy,
  group,
}: {
  policy: Policy;
  group: GroupWithMask;
}) => Promise<Policy>;
