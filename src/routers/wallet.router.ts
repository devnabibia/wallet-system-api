import { Router } from "express";

import { WalletController } from "../controllers/wallet.controller";
import { exceptionEscalator } from "../helpers/exception.helper";
import { jwtMiddleware } from "../middlewares/jwt.middleware";
import { validator } from "../helpers/validator.helper";
import {
  CreateWalletDto,
  DepositWalletDto,
  UpdateWalletDto,
  WithdrawWalletDto,
} from "../dto/wallet.dto";

export const walletRouter = Router();

const walletController = new WalletController();

walletRouter.use(jwtMiddleware);

walletRouter.post(
  "/wallet/",
  validator({ dto: new CreateWalletDto() }),
  exceptionEscalator(walletController.create)
);
walletRouter.get("/wallet/", exceptionEscalator(walletController.get));
walletRouter.patch(
  "/wallet/",
  validator({ dto: new UpdateWalletDto() }),
  exceptionEscalator(walletController.update)
);
walletRouter.delete("/wallet/", exceptionEscalator(walletController.delete));
walletRouter.post(
  "/wallet/deposit/",
  validator({ dto: new DepositWalletDto() }),
  exceptionEscalator(walletController.deposit)
);
walletRouter.post(
  "/wallet/withdraw/",
  validator({ dto: new WithdrawWalletDto() }),
  exceptionEscalator(walletController.withdraw)
);
