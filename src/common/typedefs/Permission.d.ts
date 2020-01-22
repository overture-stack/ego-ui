import { User } from 'common/typedefs/User';

export type TMaskLevel = 'READ' | 'WRITE' | 'DENY';

export interface Permission {
  id: string;
  accessLevel: TMaskLevel;
  owner: User;
  policy: {
    name: string;
    id: string;
  };
}
