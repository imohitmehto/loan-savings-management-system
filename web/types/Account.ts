export interface Account {
  id: string;
  accountNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  groupId?: string;
  parentAccountId?: string;
  type: string;
  status: string;
  createdAt: string;
  dob?: string;
  groupName?: string;
  imageUrl?: string;
  balance?: number;
}
