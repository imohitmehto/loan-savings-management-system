import { z } from "zod";

// Loan Policy Schema
export const LoanPolicyFormSchema = z.object({
  id: z.string().uuid("Invalid loan policy ID"),

  name: z
    .string({
      required_error: "Policy name is required",
    })
    .min(1, "Policy name cannot be empty"),

  description: z.string().nullable().optional(),

  interestRate: z
    .number({ invalid_type_error: "Interest rate must be a number" })
    .positive("Interest rate must be positive")
    .nullable()
    .optional(),

  minCreditScore: z
    .number({
      required_error: "Minimum credit score is required",
      invalid_type_error: "Minimum credit score must be a number",
    })
    .int("Minimum credit score must be an integer")
    .min(0, "Credit score cannot be negative"),

  maxLoanAmount: z
    .number({
      required_error: "Maximum loan amount is required",
      invalid_type_error: "Max loan amount must be a number",
    })
    .positive("Maximum loan amount must be greater than 0"),

  rules: z.record(z.any(), {
    required_error: "Policy rules are required",
  }),

  isActive: z.boolean(),

  createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid createdAt date",
  }),

  updatedAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid updatedAt date",
  }),

  loans: z
    .array(
      z.object({
        id: z.string().uuid("Invalid loan ID"),
        loanNumber: z.string().min(1, "Loan number is required"),
        principal: z
          .number({ invalid_type_error: "Principal must be a number" })
          .positive("Principal must be greater than 0"),
        interestRate: z
          .number({ invalid_type_error: "Interest rate must be a number" })
          .positive("Interest rate must be greater than 0"),
        durationMonths: z
          .number({ invalid_type_error: "Duration must be a number" })
          .int("Duration must be an integer")
          .positive("Duration must be greater than 0"),
        emiAmount: z
          .number({ invalid_type_error: "EMI amount must be a number" })
          .positive("EMI amount must be greater than 0"),
        startDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
          message: "Invalid start date",
        }),
        endDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
          message: "Invalid end date",
        }),
        status: z.string().min(1, "Status is required"),
        userId: z.string().uuid("Invalid user ID"),
        loanTypeId: z.string().uuid("Invalid loan type ID"),
        policyId: z.string().uuid("Invalid loan policy ID"),
      }),
    )
    .optional(),
});

export type LoanPolicyType = z.infer<typeof LoanPolicyFormSchema>;
