export interface User {
  id: number;
  name: string;
  email: string;
  created_at: Date;
  updated_at: Date;
  Doc: string;
  IDRol: number;
  Estado: string;
  colaborador?: any;
}
