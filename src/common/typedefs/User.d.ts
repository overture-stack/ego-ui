enum EgoProviderType {
  GOOGLE = 'GOOGLE',
  GITHUB = 'GITHUB',
  LINKEDIN = 'LINKEDIN',
  ORCID = 'ORCID',
}

enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
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
}
