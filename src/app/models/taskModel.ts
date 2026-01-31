export interface Task {
  id?: number;
  projectId: number;
  title: string;
  description?: string;
  status?: string; 
  priority?: string;
  assignedId?: number;
  dueDate?: Date;
  orderIndex?: number;
  createdAt?: Date;
  updatedAt?: Date;

}

export interface Task_ret {
  id?: number;
  project_id: number;
  title: string;
  description?: string;
  status?: string; 
  priority?: string;
  assigned_id?: number;
  due_date?: Date;
  order_index?: number;
  created_at?: Date;
  updated_at?: Date;

}
