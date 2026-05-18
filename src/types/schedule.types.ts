export interface Task {
  number: string;
  name: string;
  assigned_to: string;
  start_date: string;
  end_date: string;
  days: number;
  completed?: boolean;
}

export interface Stage {
  name: string;
  description?: string | null;
  order: number;
  start_date: string;
  end_date: string;
  days: number;
  tasks: Task[];
}

export interface WorkSchedule {
  id: string;
  work_id: number;
  stages: Stage[];
  created_at: string;
  updated_at: string;
}

// Schedule DTOs
export interface CreateTaskDto {
  number: string;
  name: string;
  assigned_to: string;
  start_date: string;
  end_date: string;
}

export interface CreateStageDto {
  name: string;
  description?: string;
  order: number;
  start_date: string;
  end_date: string;
  tasks?: CreateTaskDto[];
}

export interface CreateScheduleDto {
  work_id: number;
  stages?: CreateStageDto[];
}
