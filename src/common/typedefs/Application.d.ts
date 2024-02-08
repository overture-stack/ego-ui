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
