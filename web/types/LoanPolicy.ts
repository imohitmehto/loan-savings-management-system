import {
  FeeType,
  InterestType,
  TermPeriod,
} from '@/utils/enums/loan-policy-enum';

export interface LoanPolicy {
  id: string;
  name: string;
  description?: string | null;
  minAmount: number;
  maxAmount: number;
  interestType: InterestType;
  interestRate: number;
  termPeriod: TermPeriod;
  maxTerm: number;
  applicationFeeType: FeeType;
  applicationFee: number;
  processingFeeType: FeeType;
  processingFee: number;
  latePaymentPenaltiesType: FeeType;
  latePaymentPenalties: number;
  rules: string[];
  isActive: boolean;
}
