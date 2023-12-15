export interface LoginToken {
  user: { role: number; userId: string; username: string };
  access_token: string;
  tokenType: string;
}


export type LoginResponse = | {
  status: true,
  data: LoginToken
} | {
  status: false,
  error: any
}
