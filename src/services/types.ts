import { Application, Group, User } from '../common/typedefs';

export type UpdateEntity<T> = ({ item }: { item: T }) => Promise<T>;

// "key" should be renamed to "childResource" or something like that
// "value" should renamed to "childId"
export type AddToEntity<T> = ({
  entity,
  key,
  value,
}: {
  entity: T;
  key: string;
  value: string;
}) => Promise<User>;
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
