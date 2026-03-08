export type MemberRole = 'Backend' | 'UI' | 'QA' | 'Business Analyst';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  country: string;
  active: boolean;
}

export interface Sprint {
  id: string;
  increment_id: string;
  name: string;
  order: number;
}
