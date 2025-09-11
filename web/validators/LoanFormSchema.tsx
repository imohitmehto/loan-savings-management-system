import { z } from 'zod';
import { LoanStatus } from '@/types/Loan';

export const LoanFormSchema = z.object({
  loanNumber: z
    .string({
      required_error: 'Loan number is required',
    })
    .min(1, 'Loan number is required'),

  userId: z
    .string({
      required_error: 'Borrower is required',
    })
    .uuid('Invalid borrower ID'),

  loanTypeId: z
    .string({
      required_error: 'Loan type is required',
    })
    .uuid('Invalid loan type ID'),

  policyId: z
    .string({
      required_error: 'Loan policy is required',
    })
    .uuid('Invalid loan policy ID'),

  principal: z
    .number({
      required_error: 'Principal amount is required',
      invalid_type_error: 'Principal must be a number',
    })
    .positive('Principal must be greater than 0'),

  interestRate: z
    .number({
      required_error: 'Interest rate is required',
      invalid_type_error: 'Interest rate must be a number',
    })
    .positive('Interest rate must be greater than 0'),

  durationMonths: z
    .number({
      required_error: 'Duration in months is required',
      invalid_type_error: 'Duration must be a number',
    })
    .int('Duration must be an integer')
    .positive('Duration must be greater than 0'),

  emiAmount: z
    .number({
      required_error: 'EMI amount is required',
      invalid_type_error: 'EMI amount must be a number',
    })
    .positive('EMI amount must be greater than 0'),

  startDate: z
    .string({
      required_error: 'Start date is required',
    })
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Invalid start date',
    }),

  endDate: z
    .string({
      required_error: 'End date is required',
    })
    .refine(date => !isNaN(Date.parse(date)), {
      message: 'Invalid end date',
    }),

  status: z.nativeEnum(LoanStatus, {
    required_error: 'Status is required',
  }),
});

export type LoanFormValues = z.infer<typeof LoanFormSchema>;
