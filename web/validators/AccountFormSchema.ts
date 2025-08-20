"use client";
import { z } from "zod";
import { AccountType } from "@/utils/enums/account-type.enum";
import { OccupationType } from "@/utils/enums/occupation.enum";
import { Gender } from "@/utils/enums/gender.enum";

// --- Zod-compatible enum arrays ---
const ADDRESS_TYPE_ENUM = ["CURRENT", "PERMANENT", "NOMINEE"] as const;
const ACCOUNT_TYPE_ENUM = Object.values(AccountType) as [
  AccountType,
  ...AccountType[],
];
const OCCUPATION_TYPE_ENUM = Object.values(OccupationType) as [
  OccupationType,
  ...OccupationType[],
];
const GENDER_ENUM = Object.values(Gender) as [Gender, ...Gender[]];

// --- Address Schema ---
const AddressSchema = z.object({
  type: z.enum(ADDRESS_TYPE_ENUM, {
    errorMap: () => ({ message: "Select address type" }),
  }),
  addressLine1: z.string().trim().nonempty("This field is required."),
  addressLine2: z.string().trim().optional(),
  landmark: z.string().trim().optional(),
  city: z.string().trim().nonempty("This field is required."),
  state: z.string().trim().nonempty("This field is required."),
  country: z.string().trim().nonempty("This field is required."),
  pinCode: z.string().trim().length(6, "Pin code must be exactly 6 characters"),
});

// --- Nominee Schema ---
const NomineeSchema = z.object({
  firstName: z.string().trim().nonempty("This field is required."),
  lastName: z.string().trim().nonempty("This field is required."),
  relation: z.string().trim().nonempty("This field is required."),
  email: z.string().trim().email("Invalid email").optional(),
  phoneNumber: z.string().trim().optional(), // backend allows optional
  sameAsUserAddress: z.boolean().optional().default(false),
  address: AddressSchema.omit({ type: true }).extend({
    type: z.literal("NOMINEE").optional(), // backend sets default, so optional
  }),
});

// --- Main Form Schema ---
export const AccountFormSchema = z.object({
  firstName: z.string().trim().nonempty("This field is required."),
  lastName: z.string().trim().nonempty("This field is required."),
  fatherSpouse: z.string().trim().nonempty("This field is required."),
  occupation: z.enum(OCCUPATION_TYPE_ENUM, {
    errorMap: () => ({ message: "This field is required." }),
  }),
  companyInstitute: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .nonempty("This field is required.")
    .email("Email must be valid"),
  phone: z.string().trim().nonempty("This field is required."),
  gender: z.enum(GENDER_ENUM, {
    errorMap: () => ({ message: "This field is required." }),
  }),
  dob: z.string().trim().nonempty("This field is required."),
  type: z.enum(ACCOUNT_TYPE_ENUM, {
    errorMap: () => ({ message: "This field is required." }),
  }),

  // Addresses - directly an array to match backend
  addresses: z
    .array(AddressSchema)
    .nonempty("At least one address is required."),

  // Nominees - optional array
  nominees: z.array(NomineeSchema).optional(),
});

export type AccountFormSchemaType = z.infer<typeof AccountFormSchema>;
