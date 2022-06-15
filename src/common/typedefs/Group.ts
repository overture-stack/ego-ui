interface RequiredGroupFields {
  name: string;
  status: string;
}

export interface Group extends RequiredGroupFields {
  id: string;
  description: string | null;
}

export type CreateGroupInput = RequiredGroupFields & Partial<Group>;
