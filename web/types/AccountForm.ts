export interface Address {
  type: "CURRENT" | "PERMANENT" | "NOMINEE";
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

  image?: File | null;
  imagePreviewUrl?: string;
  panCard?: File | null;
  panCardPreview?: string;
  aadhaarCard?: File | null;
  aadhaarCardPreview?: string;

  addresses: AddressesGroup;
  nominees?: Nominee[];
}
