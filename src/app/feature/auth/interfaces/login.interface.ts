export interface LoginResponse {
  user: { role: number; userId: string; username: string };
  access_token: string;
  tokenType: string;
}
