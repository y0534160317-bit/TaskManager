


export interface CommentRequest {
  taskId: number;
  body: string;
}

export interface Comment {
  id?: number;
  task_id: number;
  user_id: number;
  body: string;
  created_at?: Date;
}