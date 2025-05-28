
export interface RequestData {
  id: number;
  status: string;
  priority: string;
  description?: string;
  client_id?: number;
  team_id?: number;
  scheduled_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ClientData {
  id: number;
  first_name: string;
  last_name: string;
  [key: string]: any;
}

export interface TeamData {
  id: number;
  name: string;
  [key: string]: any;
}

export interface VolunteerData {
  id: number;
  first_name: string;
  last_name: string;
  [key: string]: any;
}
