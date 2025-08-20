export enum LoanStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  DEFAULTED = "DEFAULTED",
  PENDING = "PENDING",
}

export interface Loan {
  id: string;
  loanNumber: string;
  principal: number;
  interestRate: number;
  durationMonths: number;
  emiAmount: number;
  startDate: string;
  endDate: string;
  status: LoanStatus;
  userId: string;
  loanTypeId: string;
  policyId: string;
  user?: { id: string; firstName?: string; lastName?: string; email?: string };
  loanType?: { id: string; name: string; description?: string };
  policy?: { id: string; name: string; description?: string };
  repayments?: any[];
}
