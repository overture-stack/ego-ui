export interface ApiKey {
  exp: string;
  iss: string;
  name: string;
  description: string;
  scope: [string];
}
