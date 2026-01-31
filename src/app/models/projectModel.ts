
export interface ProjectRequest {
  teamId: number;      
  name: string;
  description?: string;
  status?: string;
}

export interface Project {
  id?: number;
  team_id: number;     
  name: string;
  description?: string;
  status?: string;
  created_at?: Date;
}