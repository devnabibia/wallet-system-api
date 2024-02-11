import type { Prisma } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import {
  DatabaseException,
  ExceptionCodes,
} from "../exceptions/database.exception";
import { popKeys } from "../helpers";
import type {
  ICreateWallet,
  IDeleteWallet,
  IGetWallet,
  IGetWalletBy,
  IListWallets,
  IUpdateWallet,
} from "../interface/wallet.interface";
import { UserDao } from "./user.dao";

export class WalletDao {
  private readonly prismaService = new PrismaService();

  private readonly userDao = new UserDao();

  async list(dto?: IListWallets) {
    const { skip = 0, take = 10 } = popKeys(dto || {}, "skip", "take");

    return await this.prismaService.wallet.findMany({ skip, take });
  }

  async create(dto: ICreateWallet) {
    const { userId } = popKeys(dto, "userId");

    const userDoesNotExist = !(await this.userDao.get({
      id: userId as string,
    }));
    if (userDoesNotExist) {
      throw new DatabaseException(
        ExceptionCodes.NOT_FOUND,
        "user does not exist"
      );
    }

    const walletExists = await this.getBy({
      field: "userId",
      value: userId as string,
    });

    if (walletExists) {
      throw new DatabaseException(
        ExceptionCodes.DUPLICATE_ENTRY,
        "wallet already exists"
      );
    }

    return await this.prismaService.wallet.create({
      data: {
        ...(dto as unknown as Prisma.WalletCreateInput),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async get(dto: IGetWallet) {
    return await this.getBy({ field: "id", value: dto.id });
  }

  async getBy(dto: IGetWalletBy) {
    return await this.prismaService.wallet.findFirst({
      where: {
        [dto.field]: dto.value,
      },
    });
  }

  async update(dto: IUpdateWallet) {
    const { field, value } = popKeys(dto, "field", "value");

    const wallet = await this.getBy({
      field: field as any,
      value: value as any,
    });
    if (!wallet) {
      throw new DatabaseException(ExceptionCodes.NOT_FOUND, "wallet not found");
    }

    return await this.prismaService.wallet.update({
      where: { id: wallet.id },
      data: dto,
    });
  }

  async delete(dto: IDeleteWallet) {
    const wallet = await this.getBy({ field: dto.field, value: dto.value });
    if (!wallet) {
      throw new DatabaseException(ExceptionCodes.NOT_FOUND, "wallet not found");
    }

    await this.prismaService.wallet.delete({ where: { id: wallet.id } });
  }
}
