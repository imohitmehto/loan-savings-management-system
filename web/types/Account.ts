export interface Account {
  id: string;
  accountNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  groupId?: string; // Optional for individual accounts
  parentAccountId?: string; // Optional for child accounts
  type: "SAVINGS" | "CURRENT" | "LOAN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  createdAt: string;
  // add more fields as needed
}
