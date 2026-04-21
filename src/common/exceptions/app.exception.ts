export class ApplicationError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number, cause?: unknown) {
    super(message, { cause });

    this.statusCode = statusCode;

    Object.setPrototypeOf(this, new.target.prototype);

    this.name = this.constructor.name;

    Error.captureStackTrace?.(this, this.constructor);
  }
}
