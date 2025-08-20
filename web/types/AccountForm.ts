import { ChangeEventHandler } from "react";

export interface Address {
  type: "CURRENT" | "PERMANENT" | "NOMINEE" | string;
  addressLine1: string;
  addressLine2?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

export interface AddressesGroup {
  current: Address;
  permanent: Address;
  sameAsUserAddress?: boolean;
}

export interface Nominee {
  firstName: string;
  lastName: string;
  relation: string;
  email?: string;
  phoneNumber?: string;
  address: Address;
  sameAsUserAddress?: boolean;
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
  groupId?: string;
  groupName?: string;
  isChildAccount?: boolean;
  parentAccountId?: string;
  status?: string;
  accountOpeningFee?: string;

  imageFile?: File | null;
  imagePreviewUrl?: string;
  panCardFile?: File | null;
  panCardPreview?: string;
  aadhaarCardFile?: File | null;
  aadhaarCardPreview?: string;

  addresses: AddressesGroup;
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
  onChange: React.ChangeEventHandler<
    HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
  >;
  groupOptions: { value: string; label: string }[];
  parentAccountOptions?: { value: string; label: string }[];
  disabled?: boolean;
  onSearchGroups?: (search: string, page: number) => Promise<any>;
  onSearchParentAccounts?: (search: string, page: number) => Promise<any>;
}
