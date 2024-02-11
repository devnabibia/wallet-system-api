import * as crypto from "crypto";

import {
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_NOT_ACCEPTABLE,
  HTTP_STATUS_NOT_FOUND,
} from "../constants/status-codes";
import { TransactionDao } from "../dao/transaction.dao";
import { WalletDao } from "../dao/wallet.dao";
import { HttpException } from "../exceptions/http.exception";
import { popKeys } from "../helpers";
import { HashHelper } from "../helpers/hash.helper";
import {
  TransactionStatus,
  TransactionType,
} from "../interface/transaction.interface";
import type {
  ICreateWallet,
  IDepositWallet,
  IUpdateWallet,
  IWithdrawWallet,
} from "../interface/wallet.interface";

export class WalletService {
  private readonly walletDao = new WalletDao();
  private readonly transactionDao = new TransactionDao();

  private hashHelper = new HashHelper();

  private generateReference(length = 10) {
    return crypto.randomBytes(length).toString("hex").toUpperCase();
  }

  private async getBalance(dto: { userId: string }) {
    const totalDebit = await this.transactionDao.sum({
      userId: dto.userId,
      status: TransactionStatus.SUCCESSFUL,
      type: TransactionType.DEBIT,
    });
    const totalCredit = await this.transactionDao.sum({
      userId: dto.userId,
      status: TransactionStatus.SUCCESSFUL,
      type: TransactionType.CREDIT,
    });

    const balance = totalCredit - totalDebit;

    return balance;
  }

  async create(dto: Omit<ICreateWallet, "address">) {
    dto.passphrase = await this.hashHelper.hash(dto.passphrase);

    const wallet = await this.walletDao.create({
      ...dto,
      address: this.generateReference(5),
    });

    popKeys(wallet, "passphrase");

    return wallet;
  }

  async get(dto: { userId: string }) {
    const wallet = await this.walletDao.getBy({
      field: "userId",
      value: dto.userId,
    });
    if (!wallet) {
      throw new HttpException(HTTP_STATUS_NOT_FOUND, "wallet not found");
    }

    popKeys(wallet, "passphrase");

    return {
      ...wallet,
      balance: await this.getBalance({ userId: dto.userId }),
    };
  }

  async update(dto: Pick<IUpdateWallet, "passphrase"> & { userId: string }) {
    if (dto.passphrase) {
      dto.passphrase = await this.hashHelper.hash(dto.passphrase);
    }

    const wallet = await this.walletDao.update({
      ...dto,
      field: "userId",
      value: dto.userId,
    });

    popKeys(wallet, "passphrase");

    return wallet;
  }

  async delete(dto: { userId: string }) {
    await this.walletDao.delete({ field: "userId", value: dto.userId });
  }

  async deposit(dto: IDepositWallet) {
    const wallet = await this.walletDao.getBy({
      field: "userId",
      value: dto.userId,
    });
    if (!wallet) {
      throw new HttpException(HTTP_STATUS_NOT_FOUND, "wallet not found");
    }

    // TODO: publish transaction to be processed by an event
    await this.transactionDao.create({
      walletId: wallet.id,
      reference: this.generateReference(),
      amount: dto.amount,
      type: TransactionType.CREDIT,
      status: TransactionStatus.SUCCESSFUL,
    });

    return {
      balance: await this.getBalance({ userId: dto.userId }),
    };
  }

  async withdraw(dto: IWithdrawWallet) {
    const wallet = await this.walletDao.getBy({
      field: "userId",
      value: dto.userId,
    });
    if (!wallet) {
      throw new HttpException(HTTP_STATUS_NOT_FOUND, "wallet not found");
    }

    const passphraseIsCorrect = await this.hashHelper.compare(
      wallet.passphrase,
      dto.passphrase
    );
    if (!passphraseIsCorrect) {
      throw new HttpException(HTTP_STATUS_FORBIDDEN, "passphrase is incorrect");
    }

    const availableBalance = await this.getBalance({ userId: dto.userId });
    if (dto.amount > availableBalance) {
      throw new HttpException(
        HTTP_STATUS_NOT_ACCEPTABLE,
        "insufficient balance"
      );
    }

    // TODO: publish transaction to be processed by an event
    await this.transactionDao.create({
      walletId: wallet.id,
      reference: this.generateReference(),
      amount: dto.amount,
      type: TransactionType.DEBIT,
      status: TransactionStatus.SUCCESSFUL,
    });

    return { balance: await this.getBalance({ userId: dto.userId }) };
  }
}
