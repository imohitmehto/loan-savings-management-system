import { z } from 'zod';
import {
  FeeType,
  InterestType,
  TermPeriod,
} from '@/utils/enums/loan-policy-enum';

export const LoanPolicyFormSchema = z.object({
  name: z
    .string({ required_error: 'Policy name is required' })
    .min(1, 'Policy name cannot be empty'),
  description: z.string().nullable().optional(),
  minAmount: z
    .number({ required_error: 'Minimum loan amount is required' })
    .positive('Minimum amount must be greater than 0'),
  maxAmount: z
    .number({ required_error: 'Maximum loan amount is required' })
    .positive('Maximum amount must be greater than 0'),
  interestType: z.nativeEnum(InterestType),
  interestRate: z
    .number({ invalid_type_error: 'Interest rate must be a number' })
    .positive('Interest rate must be positive'),
  termPeriod: z.nativeEnum(TermPeriod),
  maxTerm: z
    .number({ required_error: 'Maximum term is required' })
    .int()
    .positive('Maximum term must be greater than 0'),
  applicationFeeType: z.nativeEnum(FeeType),
  applicationFee: z
    .number({ required_error: 'Application fee is required' })
    .min(0, 'Application fee cannot be negative'),
  processingFeeType: z.nativeEnum(FeeType),
  processingFee: z
    .number({ required_error: 'Processing fee is required' })
    .min(0, 'Processing fee cannot be negative'),
  latePaymentPenaltiesType: z.nativeEnum(FeeType),
  latePaymentPenalties: z
    .number({ required_error: 'Late payment penalty is required' })
    .min(0, 'Late payment penalty cannot be negative'),
  rules: z.array(z.string()).min(1, 'At least one rule required'),
  isActive: z.boolean(),
});
