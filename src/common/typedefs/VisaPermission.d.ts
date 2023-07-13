import { User } from 'common/typedefs/User';
import { Visa } from 'common/typedefs/Visa';

export type TMaskLevel = 'READ' | 'WRITE' | 'DENY';

export interface VisaPermission {
  id: string;
  accessLevel: TMaskLevel;
  owner: User;
  policy: {
    name: string;
    id: string;
  };
  visa: Visa;
}
