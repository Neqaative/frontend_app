import { User, Role } from './user.types';
import { Client } from './client.types';

export enum Status {
  submitted = 'submitted',
  under_review = 'under_review',
  field_work = 'field_work',
  compilation = 'compilation',
  under_clause = 'under_clause',
  correction = 'correction',
  classified = 'classified',
  delivered = 'delivered'
}

export enum WorkRole {
  fieldworker = 'fieldworker',
  completer = 'completer'
}

export interface Assignment {
  userId: number;
  role: WorkRole;
}

export interface WorkAssignment {
  work_assignment_id: number;
  work_id: number;
  user_id: number;
  role: WorkRole;
  assigned_at: Date;
  user: User;
}

export interface Work {
  work_id: number;
  name: string;
  city: string;
  district: string;
  region: string;
  parcel_number: string;
  operator_id: number;
  report_id: string;
  report_date: Date;
  notification_date: Date;
  fieldwork_date: Date;
  completion_date: Date;
  ready_date: Date;
  acceptance_date: Date;
  status: Status;
  comments?: string;
  client_id: number;
  user?: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    role: Role;
  };
  client?: Client;
  assignments?: WorkAssignment[];
  created_at: Date;
  updated_at: Date;
}

export interface CreateWorkDto {
  name: string;
  city: string;
  district: string;
  region: string;
  parcel_number: string;
  operator_id: number;
  report_id: string;
  report_date: Date;
  notification_date: Date;
  fieldwork_date: Date;
  completion_date: Date;
  ready_date: Date;
  acceptance_date: Date;
  status: Status;
  comments?: string;
  client_id: number;
  assignments: Assignment[];
}

export interface UpdateWorkDto extends Partial<CreateWorkDto> {}
