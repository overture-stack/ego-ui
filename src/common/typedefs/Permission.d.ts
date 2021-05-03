import { Entity } from '.';
import { Policy } from './Policy';

export type MaskLevel = 'READ' | 'WRITE' | 'DENY';

export interface Permission {
  id: string;
  accessLevel: MaskLevel;
  owner: Entity;
  policy: Policy;
}
