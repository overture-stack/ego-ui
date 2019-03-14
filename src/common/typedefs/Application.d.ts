export interface Application {
  id: string;
  name: string;
  description: string;
  status: string;
  type: string;
  clientId?: string;
  redirectUri?: string;
}
