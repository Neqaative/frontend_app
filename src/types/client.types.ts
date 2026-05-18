export interface Client {
  client_id: number;
  name: string;
  contact?: string;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateClientDto {
  name: string;
  contact?: string;
  notes?: string;
}
