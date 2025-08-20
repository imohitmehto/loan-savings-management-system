import { Address, Nominee, AccountFormValues } from "@/types/AccountForm";

// --- Empty Data Templates ---
export const emptyAddress: Address = {
  type: "CURRENT",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  country: "",
  pinCode: "",
};

export const emptyNominee: Nominee = {
  firstName: "",
  lastName: "",
  relation: "",
  email: "",
  phoneNumber: "",
  address: { ...emptyAddress, type: "NOMINEE" },
  sameAsUserAddress: false,
};

export const emptyForm: AccountFormValues & {
  isChildAccount?: boolean;
  parentAccountId?: string;
} = {
  firstName: "",
  lastName: "",
  fatherSpouse: "",
  occupation: "",
  companyInstitute: "",
  email: "",
  phone: "",
  gender: "" as AccountFormValues["gender"],
  dob: "",
  type: "" as AccountFormValues["type"],
  groupName: "",
  imageFile: null,
  imagePreviewUrl: "",
  panCardFile: null,
  panCardPreview: "",
  aadhaarCardFile: null,
  aadhaarCardPreview: "",
  addresses: {
    current: { ...emptyAddress, type: "CURRENT" },
    permanent: { ...emptyAddress, type: "PERMANENT" },
    sameAsUserAddress: false,
  },
  nominees: [],
  isChildAccount: false,
  parentAccountId: "",
};
