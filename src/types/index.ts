

export interface Policy {
    id: string;
    name: string;
    description?: string;
}


export interface PolicyListProps {
    policies?: InsurancePolicy[] | null;
    onSelect: (selectedPolicy: InsurancePolicy) => void;
    fetchingPolicy: boolean;
}

export interface CoverageDetailsProps {
  selectedPolicy: InsurancePolicy;
  onContinue: (data: any) => void;
}

export interface ApiErrorResponse {
  status: number;
  code: string;
  message: string;
  timestamp: string;
  path: string;
}

export interface LoginResponse {
  refreshToken: string;
  expiresInSeconds: number;
  expiration: string;
  issuedAt: string;
}

export interface AccessTokenResponse {
  accessToken: string;
  expiresInSeconds: number;
  expiration: string;
  issuedAt: string;
}


export interface Policy {
  userPolicyId: string;
  name: string;
  type: PolicyType;
  status: PolicyStatus;
  coverageAmount: number;
}

export interface PolicyProps {
  policies: Policy[];
}


export enum PolicyType {
  LIFE = "Life",
  HOME = "Home",
  AUTO = "Auto",
}

export enum PolicyStatus {
  ACTIVE = "Active",
  LAPSED = "Lapsed",
  COMPLETED = "Completed",
}


export interface PolicyDetails {
  policy: {
    name: string;
    type: PolicyType;
  };
  userPolicy: {
    userPolicyId: string;
    status: PolicyStatus;
    coverageAmount: number;
    monthlyPremiumAmount: number;
    paymentMode: string;
    paymentDueDate: string;
    termInMonths: number;
    startDate: string;
    endDate: string;
    termRemainingInMonths: number;
    haveDocument: boolean;
  };
  quoteBreakdown: QuoteBreakdown;
}

export interface UserPolicyPayment {
  id: string;
  userId: string;
  userPolicyId: string;
  amount: number;
  status: PolicyStatus;
  paymentDate: string | null;
  billingSchedule: string | null;
  month: number;
  createdAt: string;
  updatedAt: string;
}

export type UserPolicyPaymentList = UserPolicyPayment[];

export interface InsurancePolicy {
  id: string;
  name: string;
  type: PolicyType;
  coverageAmount: number;
  premiumPerMonth: number;
  termLengthInMonths: number;
}

export interface PoliciesResponse {
  policies: InsurancePolicy[];
}

export interface UserQuotePolicyResponse {
  userQuoteId: string;
  policy: UserQuotePolicyResponse.Policy;
  details: any;
  coverageAmount: number;
  premiumPerMonth: number;
  termLengthInMonths: number;
  quoteBreakdown: QuoteBreakdown;
}

export interface QuoteBreakdown {
  total: number;
  components: QuoteComponent[];
}

export interface QuoteComponent {
  description: string;
  amount: number;
}

export namespace UserQuotePolicyResponse {
  export interface Policy {
    id: string;
    name: string;
    type: PolicyType;
  }
}

export interface ActivatePolicyResponse {
  userPolicyId: string;
}

export interface StandardUserDashboardStats {
  activePolicies: number;
  pendingApplications: number;
}

export type UserStatus = "ACTIVE" | "INACTIVE";
export type UserRole = "USER" | "ADMIN";

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: UserStatus;
  roles: UserRole[];
  createdAt: string;
  updatedAt: string;
}

export interface PolicyIssuedData {
  data: DailyPolicyIssued[];
}

export interface DailyPolicyIssued {
  date: string;
  policiesIssued: number;
}