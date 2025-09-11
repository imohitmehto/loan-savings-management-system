// Transaction reason/type categories
export enum TransactionType {
  MONTHLY_PAYMENT = 'MONTHLY_PAYMENT',
  DEBIT = 'DEBIT',
  LOAN_REPAYMENT = 'LOAN_REPAYMENT',
  LOAN_DEBIT = 'LOAN_DEBIT',
  PENALTY = 'PENALTY',
  CASH_TO_BANK = 'CASH_TO_BANK',
  BANK_TO_CASH = 'BANK_TO_CASH',
  BANK_TO_FD = 'BANK_TO_FD',
  EXPENSE = 'EXPENSE',
}

// Credit or debit direction
export enum TransactionDirection {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

// Payment methods
export enum PaymentMode {
  UPI = 'UPI',
  CASH = 'CASH',
  BANK_TRANSFER = 'BANK_TRANSFER',
  CHEQUE = 'CHEQUE',
}

// Transaction approval or lifecycle state
export enum TransactionStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export interface Transaction {
  id: string;
  type: TransactionType;
  transactionDirection: TransactionDirection; // NEW — explicit debit/credit
  amount: number;
  description?: string | null;
  paymentMode: PaymentMode;
  status: TransactionStatus;
  accountId: string;
  createdById: string;
  createdAt: string;

  // Optional related data
  account?: {
    id: string;
    accountNumber: string;
    firstName?: string;
    lastName?: string;
    imageUrl?: string;
  };
  createdBy?: {
    id: string;
    name: string;
  };
}
