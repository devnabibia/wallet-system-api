import * as argon from "argon2";

export class HashHelper {
  async hash(text: string) {
    return await argon.hash(text);
  }

  async compare(hash: string, text: string) {
    return await argon.verify(hash, text);
  }
}
