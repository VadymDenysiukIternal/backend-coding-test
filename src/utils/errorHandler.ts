export class ErrorHandler extends Error {
  private statusCode: number;
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}
