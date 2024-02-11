import type { Prisma } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import {
  DatabaseException,
  ExceptionCodes,
} from "../exceptions/database.exception";
import { popKeys } from "../helpers";
import type {
  ICreateTransaction,
  IDeleteTransaction,
  IGetTransaction,
  IGetTransactionBy,
  IListTransactions,
  IUpdateTransaction,
} from "../interface/transaction.interface";

export class TransactionDao {
  private readonly prismaService = new PrismaService();

  async list(dto?: IListTransactions) {
    const {
      skip = 0,
      take = 10,
      walletId,
    } = popKeys(dto as IListTransactions, "skip", "take", "walletId");

    return await this.prismaService.transaction.findMany({
      where: {
        walletId,
      },
      skip,
      take,
    });
  }

  async create(dto: ICreateTransaction) {
    const { walletId } = popKeys(dto, "walletId");

    return await this.prismaService.transaction.create({
      data: {
        ...(dto as unknown as Prisma.TransactionCreateInput),
        wallet: { connect: { id: walletId } },
      },
    });
  }

  async get(dto: IGetTransaction) {
    return await this.getBy({ field: "id", value: dto.id });
  }

  async getBy(dto: IGetTransactionBy<keyof Prisma.TransactionWhereInput, any>) {
    return await this.prismaService.transaction.findFirst({
      where: {
        [dto.field]: dto.value,
      },
    });
  }

  async update(dto: IUpdateTransaction) {
    const { id: transactionId } = popKeys(dto, "id");

    const transactionDoesNotExist = !(await this.get({
      id: transactionId as string,
    }));
    if (transactionDoesNotExist) {
      throw new DatabaseException(
        ExceptionCodes.NOT_FOUND,
        "transaction does not exist"
      );
    }

    return await this.prismaService.transaction.update({
      where: { id: transactionId as string },
      data: dto,
    });
  }

  async delete(dto: IDeleteTransaction) {
    const { id: transactionId } = popKeys(dto, "id");

    const transactionDoesNotExist = !(await this.get({
      id: transactionId as string,
    }));
    if (transactionDoesNotExist) {
      throw new DatabaseException(
        ExceptionCodes.NOT_FOUND,
        "transaction does not exist"
      );
    }

    await this.prismaService.transaction.delete({
      where: { id: transactionId as string },
    });
  }

  async sum(
    dto: { userId: string } & Pick<IListTransactions, "type" | "status">
  ) {
    const { userId } = popKeys(dto, "userId");

    const aggregation = await this.prismaService.transaction.aggregate({
      _sum: { amount: true },
      where: { ...dto, wallet: { userId } },
    });

    return aggregation._sum.amount || 0;
  }
}
