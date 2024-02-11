import {
  IsEmail,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*\d|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z])$/, {
    message:
      "password must be at least 6 characters and include uppercase, lowercase, and either a digit or a special character.",
  })
  password: string;
}

export class RefreshTokenDto {
  @IsNotEmpty()
  @IsJWT()
  token: string;
}
