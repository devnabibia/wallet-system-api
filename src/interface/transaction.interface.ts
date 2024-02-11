export enum TransactionType {
  DEBIT = "DEBIT",
  CREDIT = "CREDIT",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  SUCCESSFUL = "SUCCESSFUL",
  FAILED = "FAILED",
}

export interface IListTransactions {
  skip?: number;
  take?: number;

  walletId: string;
  type?: TransactionType;
  status?: TransactionStatus;
}

export interface ICreateTransaction {
  walletId: string;
  amount: number;
  reference: string;
  type: TransactionType;
  status?: TransactionStatus;
}

export interface IGetTransaction {
  id: string;
}

export interface IGetTransactionBy<T = string, R = string> {
  field: T;
  value: R;
}

export type IUpdateTransaction = IGetTransaction & Partial<ICreateTransaction>;

export type IDeleteTransaction = IGetTransaction;
