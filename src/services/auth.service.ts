import { JwtPayload } from "jsonwebtoken";

import { UserDao } from "../dao/user.dao";
import { HttpException } from "../exceptions/http.exception";
import { HashHelper } from "../helpers/hash.helper";
import { JwtHelper } from "../helpers/jwt.helper";
import type {
  ILogin,
  IRefreshToken,
  IRegister,
} from "../interface/user.interface";

export class AuthService {
  private userDao = new UserDao();

  private hashHelper = new HashHelper();
  private jwtHelper = new JwtHelper();

  async login(dto: ILogin) {
    const user = await this.userDao.getBy({ field: "email", value: dto.email });
    if (!user) {
      throw new HttpException(401, "invalid credentials");
    }

    const passwordIsCorrect = await this.hashHelper.compare(
      user.password,
      dto.password
    );
    if (!passwordIsCorrect) {
      throw new HttpException(401, "invalid credentials");
    }

    const tokens = await this.jwtHelper.generateTokens({ id: user.id });

    return { tokens };
  }

  async register(dto: IRegister) {
    dto.password = await this.hashHelper.hash(dto.password);

    const user = await this.userDao.create(dto);

    const tokens = await this.jwtHelper.generateTokens({ id: user.id });

    return { tokens };
  }

  async refreshToken(dto: IRefreshToken) {
    const payload = (await this.jwtHelper.verifyRefreshToken(
      dto.token
    )) as JwtPayload;

    const tokens = await this.jwtHelper.generateTokens({
      id: payload.id as string,
    });

    return { tokens };
  }
}
