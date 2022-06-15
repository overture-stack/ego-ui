interface RequiredApplicationFields {
  name: string;
  status: string;
  type: string;
  clientId: string;
  clientSecret: string;
}

export interface Application extends RequiredApplicationFields {
  id: string;
  description: string | null;
  redirectUri: string | null;
  errorRedirectUri: string | null;
}

export type CreateApplicationInput = RequiredApplicationFields & Partial<Application>;

export enum APPLICATION_TYPE {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export enum APPLICATION_STATUS {
  APPROVED = 'APPROVED',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}
