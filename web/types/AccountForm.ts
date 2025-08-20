import { ChangeEventHandler } from "react";

export interface Address {
  type: "CURRENT" | "PERMANENT" | "NOMINEE" | string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pinCode: string; // required in backend
}

export interface Nominee {
  firstName: string;
  lastName: string;
  relation: string;
  email?: string; // optional in backend
  phoneNumber?: string; // optional in backend
  address: Address;
  sameAsUserAddress?: boolean; // optional in backend
}

export interface AccountFormValues {
  firstName: string;
  lastName: string;
  fatherSpouse: string;
  occupation: "SALARIED" | "SELF_EMPLOYED" | "STUDENT" | "RETIRED" | string;
  companyInstitute?: string;
  email: string;
  phone: string;
  gender: "MALE" | "FEMALE" | "OTHER";
  dob: string;
  type: "SAVING" | "CURRENT" | "LOAN" | "FIXED_DEPOSIT" | string;
  groupId?: string; // in backend DTO
  groupName?: string; // UI-only
  isChildAccount?: boolean;
  parentAccountId?: string;

  // Files
  imageFile?: File | null;
  imagePreviewUrl?: string;
  panCardFile?: File | null;
  panCardPreview?: string;
  aadhaarCardFile?: File | null;
  aadhaarCardPreview?: string;

  // Addresses as array (matches backend)
  addresses: Address[];

  // Nominees optional
  nominees?: Nominee[];
}

export interface AccountFormProps {
  initialValues?: Partial<AccountFormValues>;
  onSubmit: (values: FormData) => Promise<void>;
  loading?: boolean;
  submitLabel?: string;
  readOnly?: boolean;
}

export interface FileUploadFieldProps {
  label: string;
  name: string;
  file?: File | null;
  filePreview?: string;
  accept?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  isCircular?: boolean;
  placeholder?: string;
}

export interface PersonalInfoSectionProps {
  form: AccountFormValues;
  errors: Record<string, string>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  groupOptions: string[];
  parentAccountOptions?: { value: string; label: string }[];
}
