import { User } from 'common/typedefs/User';

type TAccessLevel = 'READ' | 'WRITE' | 'DENY';

export interface Permission {
  id: string;
  accessLevel: TAccessLevel;
  owner: User;
  policy: {
    name: string;
    id: string;
  };
}
