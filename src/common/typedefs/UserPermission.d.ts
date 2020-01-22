import { User } from 'common/typedefs/User';

export type TMaskLevel = 'READ' | 'WRITE' | 'DENY';

export interface UserPermission {
  id: string;
  accessLevel: TMaskLevel;
  owner: User;
  policy: {
    name: string;
    id: string;
  };
}
