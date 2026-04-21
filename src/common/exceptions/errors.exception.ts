import { ApplicationError } from "./app.exception";


export class ValidationError extends ApplicationError {
  constructor(message = "Validation Error", cause?: unknown) {
    super(message, 400, { cause });
  }
}

// ------------------------

export class NotFoundError extends ApplicationError {
  constructor(message = "Resource Not Found", cause?: unknown) {
    super(message, 404, { cause });
  }
}

// ------------------------

export class UnauthorizedError extends ApplicationError {
  constructor(message = "Unauthorized", cause?: unknown) {
    super(message, 401, { cause });
  }
}
//invalid credentials, expired token, insufficient permissions, etc.
export class ForbiddenError extends ApplicationError {
  constructor(message = "Forbidden", cause?: unknown) {
    super(message, 403, { cause });
  }
}

export class InternalServerError extends ApplicationError {
  constructor(message = "Internal Server Error", cause?: unknown) {
    super(message, 500, { cause });
  }
}

export class BadRequestError extends ApplicationError {
  constructor(message = "Bad Request", cause?: unknown) {
    super(message, 400, { cause });
  }
}
export class ConflictError extends ApplicationError {
  constructor(message = "Conflict", cause?: unknown) {
    super(message, 409, { cause });
  }
}

export class TooManyRequestsError extends ApplicationError {
  constructor(message = "Too Many Requests", cause?: unknown) {
    super(message, 429, { cause });
  }
}


