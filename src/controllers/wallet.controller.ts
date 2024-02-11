import type { Response } from "express";

import {
  HTTP_STATUS_ACCEPTED,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_OK,
} from "../constants/status-codes";
import type {
  ICreateWallet,
  IDepositWallet,
  IUpdateWallet,
  IWithdrawWallet,
} from "../interface/wallet.interface";
import { WalletService } from "../services/wallet.service";

export class WalletController {
  private readonly walletService = new WalletService();

  /**
   * `POST` /api/wallet/
   */
  create = async (req: Request, res: Response) => {
    const dto = req.body as unknown as Omit<
      ICreateWallet,
      "userId" | "address"
    >;
    const userId = req.user.id as string;

    res
      .status(HTTP_STATUS_CREATED)
      .json(await this.walletService.create({ ...dto, userId }));
  };

  /**
   * `GET` /api/wallet/
   */
  get = async (req: Request, res: Response) => {
    const userId = req.user.id as string;

    res.status(HTTP_STATUS_OK).json(await this.walletService.get({ userId }));
  };

  /**
   * `PATCH` /api/wallet/
   */
  update = async (req: Request, res: Response) => {
    const dto = req.body as unknown as Pick<IUpdateWallet, "passphrase">;
    const userId = req.user.id as string;

    res
      .status(HTTP_STATUS_ACCEPTED)
      .json(await this.walletService.update({ ...dto, userId }));
  };

  /**
   * `DELETE` /api/wallet/
   */
  delete = async (req: Request, res: Response) => {
    const userId = req.user.id as string;

    res
      .status(HTTP_STATUS_NO_CONTENT)
      .json(await this.walletService.delete({ userId }));
  };

  /**
   * `POST` /api/wallet/desposit/
   */
  deposit = async (req: Request, res: Response) => {
    // TODO: generate a payment link and listen for events from the web hook

    const dto = req.body as unknown as Omit<IDepositWallet, "userId">;
    const userId = req.user.id as string;

    res
      .status(HTTP_STATUS_CREATED)
      .json(await this.walletService.deposit({ ...dto, userId }));
  };

  /**
   * `POST` /api/wallet/withdraw/
   */
  withdraw = async (req: Request, res: Response) => {
    const dto = req.body as unknown as Omit<IWithdrawWallet, "userId">;
    const userId = req.user.id as string;

    res
      .status(HTTP_STATUS_CREATED)
      .json(await this.walletService.withdraw({ ...dto, userId }));
  };
}
