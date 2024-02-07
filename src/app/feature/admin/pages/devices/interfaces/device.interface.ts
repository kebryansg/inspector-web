export interface Device {
  ID: number;
  Nombre: string;
  MAC: string;
  Token: string;
  TokenFCM: null;
  Autorizado: boolean;
  created_at: Date;
  updated_at: Date;
}
