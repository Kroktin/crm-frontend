export interface Deal {
  id: number;
  title: string;
  company: string;
  value: number;
  stage: 'new' | 'negotiation' | 'closed';
  contact: string | null;
  created_at: string;
  updated_at: string;
}

export interface Stats {
  total_deals: number;
  total_value: number;
  by_stage: { stage: string; count: number; total: number }[];
}

export type Stage = 'new' | 'negotiation' | 'closed';
