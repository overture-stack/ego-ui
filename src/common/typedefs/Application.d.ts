export interface Application {
  id: string;
  name: string;
  description: string;
  status: string;
  applicationType: string;
  clientId?: string;
  redirectUri?: string;
}
