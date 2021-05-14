enum EgoProviderType {
  GOOGLE = 'GOOGLE',
  // FACEBOOK = 'FACEBOOK',
  GITHUB = 'GITHUB',
  LINKEDIN = 'LINKEDIN',
  ORCID = 'ORCID',
}

enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface UserFromJwt {
  email: string;
  type: UserType;
  status: string;
  firstName: string;
  lastName: string;
  lastLogin: string;
  createdAt: string;
  preferredLanguage: string;
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
