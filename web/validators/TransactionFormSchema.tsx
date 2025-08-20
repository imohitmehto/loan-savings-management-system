import { z } from "zod";
import {
  TransactionType,
  TransactionStatus,
  PaymentMode,
  TransactionDirection,
} from "@/types/Transaction";

export const TransactionFormSchema = z.object({
  type: z.nativeEnum(TransactionType, {
    required_error: "Transaction type is required",
  }),

  transactionDirection: z.nativeEnum(TransactionDirection, {
    required_error: "Transaction direction is required",
  }),

  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be greater than zero"),

  paymentMode: z.nativeEnum(PaymentMode, {
    required_error: "Payment mode is required",
  }),

  description: z
    .string()
    .max(500, "Description must be under 500 characters")
    .optional()
    .or(z.literal("")),

  status: z.nativeEnum(TransactionStatus, {
    required_error: "Status is required",
  }),

  accountId: z
    .string({
      required_error: "Account is required",
    })
    .uuid("Please select a valid account"),
});

export type TransactionFormValues = z.infer<typeof TransactionFormSchema>;
