export interface Account {
  id: string;
  name: string;
  accountNumber: string;
}

export interface AccountGroup {
  id: string;
  name: string;
  description?: string;
  accounts: Account[];
}
