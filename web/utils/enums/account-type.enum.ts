export enum AccountType {
  SAVING = "SAVING",
  CURRENT = "CURRENT",
  LOAN = "LOAN",
  FIXED_DEPOSIT = "FIXED_DEPOSIT",
}

export const AccountTypeOptions = [
  ...Object.values(AccountType).map((a) => ({
    value: a,
    label: a
      .replace("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  })),
];
