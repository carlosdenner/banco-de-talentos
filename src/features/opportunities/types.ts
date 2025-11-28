export type WorkModel = 'Presencial' | 'Híbrido' | 'Remoto';

export interface Opportunity {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  requirements: string | null;
  benefits: string | null;
  location: string;
  work_model: WorkModel;
  weekly_hours: number;
  monthly_stipend: number | null;
  interest_areas: string[];
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  max_applications: number | null;
  created_by: string | null;
}

export interface OpportunityFormData {
  title: string;
  description: string;
  requirements: string;
  benefits: string;
  location: string;
  work_model: WorkModel;
  weekly_hours: number;
  monthly_stipend: number | string;
  interest_areas: string[];
  start_date: string;
  end_date: string;
  is_active: boolean;
  max_applications: number | string;
}

export const WORK_MODEL_OPTIONS: WorkModel[] = ['Presencial', 'Híbrido', 'Remoto'];
