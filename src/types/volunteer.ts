
export interface Volunteer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  is_active: boolean;
  join_date?: string | null;
  availability?: Record<string, string> | null;
  emergency_contact?: string | null;
  skills: string[];
}
