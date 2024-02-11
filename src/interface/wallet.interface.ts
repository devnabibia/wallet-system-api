import type { Prisma } from "@prisma/client";

export interface IListWallets {
  skip?: number;
  take?: number;
}

export interface ICreateWallet {
  userId: string;
  address: string;
  passphrase: string;
}

export interface IGetWallet {
  id: string;
}

export interface IGetWalletBy<T = keyof Prisma.WalletWhereInput, R = string> {
  field: T;
  value: R;
}

export type IUpdateWallet = IGetWalletBy & Partial<ICreateWallet>;

export type IDeleteWallet = IGetWalletBy;

export interface IDepositWallet {
  userId: string;
  amount: number;
}

export interface IWithdrawWallet {
  userId: string;
  amount: number;
  passphrase: string;
}
