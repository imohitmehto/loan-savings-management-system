export interface LoanPolicy {
  id: string;
  name: string;
  description?: string | null;
  interestRate?: number | null;
  minCreditScore: number;
  maxLoanAmount: number;
  rules: Record<string, any>; // JSON object for flexible policy rules
  isActive: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string

  loans?: {
    id: string;
    loanNumber: string;
    principal: number;
    interestRate: number;
    durationMonths: number;
    emiAmount: number;
    startDate: string;
    endDate: string;
    status: string;
    userId: string;
    loanTypeId: string;
    policyId: string;
  }[];
}
