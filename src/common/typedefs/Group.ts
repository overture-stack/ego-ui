interface RequiredGroupFields {
  name: string;
  status: string;
}

export interface Group extends RequiredGroupFields {
  id: string;
  description: string | null;
}

export enum GroupStatus {
  APPROVED = 'APPROVED',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export type CreateGroupInput = RequiredGroupFields & Partial<Group>;
