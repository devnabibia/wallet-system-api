import type { Prisma } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";
import {
  DatabaseException,
  ExceptionCodes,
} from "../exceptions/database.exception";
import { popKeys } from "../helpers";
import type {
  ICreateUser,
  IDeleteUser,
  IGetUser,
  IGetUserBy,
  IListUsers,
  IUpdateUser,
} from "../interface/user.interface";

export class UserDao {
  private readonly prismaService = new PrismaService();

  async list(dto?: IListUsers) {
    const { skip = 0, take = 10 } = popKeys(dto || {}, "skip", "take");

    return await this.prismaService.user.findMany({ skip, take });
  }

  async create(dto: ICreateUser) {
    const userExists = await this.prismaService.user.findFirst({
      where: { email: dto.email },
    });
    if (userExists) {
      throw new DatabaseException(
        ExceptionCodes.DUPLICATE_ENTRY,
        "user already exists"
      );
    }

    return await this.prismaService.user.create({
      data: dto,
    });
  }

  async get(dto: IGetUser) {
    return await this.getBy({ field: "id", value: dto.id });
  }

  async getBy(dto: IGetUserBy<keyof Prisma.UserWhereInput, string>) {
    return await this.prismaService.user.findFirst({
      where: {
        [dto.field]: dto.value,
      },
    });
  }

  async update(dto: IUpdateUser) {
    const { id: userId } = popKeys(dto, "id");

    const user = await this.prismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
    if (!user) {
      throw new DatabaseException(ExceptionCodes.NOT_FOUND, "user not found");
    }

    return await this.prismaService.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  async delete(dto: IDeleteUser) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: dto.id,
      },
    });
    if (!user) {
      throw new DatabaseException(ExceptionCodes.NOT_FOUND, "user not found");
    }

    await this.prismaService.user.delete({ where: { id: dto.id } });
  }
}
