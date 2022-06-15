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

export enum ApplicationType {
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export enum ApplicationStatus {
  APPROVED = 'APPROVED',
  DISABLED = 'DISABLED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}
