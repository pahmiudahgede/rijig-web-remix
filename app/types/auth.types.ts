export type UserRole = "administrator" | "pengelola";
export type RegistrationStatus =
  | "uncomplete"
  | "awaiting_approval"
  | "approved"
  | "complete";
export type TokenType = "partial" | "full";

export interface AuthTokenData {
  message: string;
  access_token: string;
  refresh_token: string;
  token_type?: TokenType;
  expires_in?: number;
  registration_status?: RegistrationStatus;
  next_step?: string;
  session_id: string;
}

export interface AdminLoginRequest {
  device_id: string;
  email: string;
  password: string;
}

export interface AdminOtpVerifyRequest {
  device_id: string;
  email: string;
  otp: string;
}

export interface AdminRegisterRequest {
  name: string;
  gender: "laki-laki" | "perempuan";
  dateofbirth: string;
  placeofbirth: string;
  phone: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  email: string;
  new_password: string;
}

export interface VerifyEmailRequest {
  email: string;
  token: string;
}

export interface PengelolaOtpRequest {
  phone: string;
  role_name: "pengelola";
}

export interface PengelolaOtpVerifyRequest {
  phone: string;
  otp: string;
  device_id: string;
  role_name: "pengelola";
}

export interface CompanyProfileRequest {
  companyname: string;
  companyaddress: string;
  companyphone: string;
  companyemail: string;
  companywebsite: string;
  taxid: string;
  foundeddate: string;
  companytype: string;
  companydescription: string;
  company_logo?: File;
}

export interface CreatePinRequest {
  userpin: string;
}

export interface VerifyPinRequest {
  userpin: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface OtpResponse {
  message: string;
  email?: string;
  expires_in_seconds: number;
  remaining_time: string;
  can_resend?: boolean;
  max_attempts?: number;
}

export interface ApprovalCheckResponse {
  message: string;
  registration_status: RegistrationStatus;
  next_step: string;
  access_token?: string;
  refresh_token?: string;
  token_type?: TokenType;
  expires_in?: number;
  session_id?: string;
}
