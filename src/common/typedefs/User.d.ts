enum EgoProviderType {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  LINKEDIN = 'LINKEDIN',
  ORCID = 'ORCID',
}

export enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  DISABLED = 'DISABLED',
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export enum UserLanguage {
  ENGLISH = 'ENGLISH',
  FRENCH = 'FRENCH',
  SPANISH = 'SPANISH',
}

export interface UserFromJwt {
  email: string;
  type: UserType;
  status: UserStatus;
  firstName: string;
  lastName: string;
  lastLogin: string;
  createdAt: string;
  preferredLanguage: UserLanguage;
  groups: string[];
  providerSubjectId: string;
  providerType: EgoProviderType;
  scope: string[];
}

export type EgoJwtData = {
  iat: number;
  exp: number;
  sub: string;
  iss: string;
  aud: string[];
  jti: string;
  context: {
    scope: string[];
    user: UserFromJwt;
  };
};

export interface User extends UserFromJwt {
  id: string;
}
