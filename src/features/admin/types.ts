export type ApplicationStatus = 'pending' | 'reviewing' | 'approved' | 'rejected';

export interface ApplicationRecord {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string | null;
  full_name: string;
  birth_date: string;
  email: string;
  whatsapp: string;
  city: string;
  institution: string;
  course: string;
  current_period: string;
  study_shift: string;
  graduation_month: number | null;
  graduation_year: number | null;
  interest_areas: string[];
  interest_areas_other: string | null;
  motivation: string;
  contributions: string;
  tools: string | null;
  has_experience: boolean;
  experience_type: string | null;
  experience_org: string | null;
  experience_period: string | null;
  experience_activities: string | null;
  experience_learnings: string | null;
  extra_info: string | null;
  how_did_you_hear: string;
  how_did_you_hear_other: string | null;
  cv_url: string | null;
  status: ApplicationStatus;
}

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  pending: 'Pendente',
  reviewing: 'Em análise',
  approved: 'Aprovado',
  rejected: 'Rejeitado',
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  reviewing: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};
