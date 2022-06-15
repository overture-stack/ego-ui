export interface ApiKey {
  expiryDate: string;
  issueDate: string;
  name: string;
  description: string;
  scope: [string];
  isRevoked: boolean;
}
