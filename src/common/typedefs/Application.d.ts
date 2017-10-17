export interface Application {
  id: string;
  name: string;
  description: string;
  status: string;
  clientId?: string;
  redirectUri?: string;
}
