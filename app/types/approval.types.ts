// app/types/approval.types.ts
export type UserRole = "pengelola" | "pengepul";
export type RegistrationStatus = "awaiting_approval" | "approved" | "rejected";
export type ApprovalAction = "approved" | "rejected";

export interface Role {
  id: string;
  role_name: UserRole;
}

export interface CompanyProfile {
  id: string;
  company_name: string;
  company_address: string;
  company_phone: string;
  company_email: string;
  company_logo: string;
  company_website: string;
  tax_id: string;
  founded_date: string;
  company_type: string;
  company_description: string;
}

export interface IdentityCard {
  id: string;
  identification_number: string;
  fullname: string;
  place_of_birth: string;
  date_of_birth: string;
  gender: "laki-laki" | "perempuan";
  blood_type: string;
  province: string;
  district: string;
  sub_district: string;
  village: string;
  postal_code: string;
  religion: string;
  marital_status: string;
  job: string;
  citizenship: string;
  valid_until: string;
  card_photo: string;
}

export interface StepInfo {
  step: number;
  status: string;
  description: string;
  requires_admin_approval: boolean;
  is_accessible: boolean;
  is_completed: boolean;
}

export interface PendingUser {
  id: string;
  phone: string;
  role: Role;
  registration_status: RegistrationStatus;
  registration_progress: number;
  submitted_at: string;
  company_profile?: CompanyProfile;
  identity_card?: IdentityCard;
  step_info: StepInfo;
}

export interface Pagination {
  page: number;
  limit: number;
  total_pages: number;
  total_records: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApprovalSummary {
  total_pending: number;
  pengelola_pending: number;
  pengepul_pending: number;
}

export interface PendingUsersResponse {
  users: PendingUser[];
  pagination: Pagination;
  summary: ApprovalSummary;
}

export interface ApprovalDetailsResponse extends PendingUser {}

export interface ApprovalActionRequest {
  user_id: string;
  action: ApprovalAction;
}

export interface ApprovalActionResponse {
  user_id: string;
  action: ApprovalAction;
  previous_status: string;
  new_status: string;
  processed_at: string;
  processed_by: string;
}