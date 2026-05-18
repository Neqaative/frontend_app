export enum Role {
  admin = 'admin',
  user = 'user'
}

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: Role;
  active: boolean;
  created_at: Date;
}
