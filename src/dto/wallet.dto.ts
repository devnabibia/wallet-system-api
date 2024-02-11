import { IsNotEmpty, IsOptional, Min } from "class-validator";

export class CreateWalletDto {
  @IsOptional()
  passphrase: string;
}

export class UpdateWalletDto {
  @IsNotEmpty()
  passphrase: string;
}

export class DepositWalletDto {
  @IsNotEmpty()
  @Min(1)
  amount: number;
}

export class WithdrawWalletDto {
  @IsNotEmpty()
  @Min(1)
  amount: number;

  @IsNotEmpty()
  passphrase: string;
}
