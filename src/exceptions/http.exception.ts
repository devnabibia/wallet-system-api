export class HttpException extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super();

    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode;
  }
}
