"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TooManyRequestsError = exports.ConflictError = exports.BadRequestError = exports.InternalServerError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = void 0;
const app_exception_1 = require("./app.exception");
class ValidationError extends app_exception_1.ApplicationError {
    constructor(message = "Validation Error", cause) {
        super(message, 400, { cause });
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends app_exception_1.ApplicationError {
    constructor(message = "Resource Not Found", cause) {
        super(message, 404, { cause });
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends app_exception_1.ApplicationError {
    constructor(message = "Unauthorized", cause) {
        super(message, 401, { cause });
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends app_exception_1.ApplicationError {
    constructor(message = "Forbidden", cause) {
        super(message, 403, { cause });
    }
}
exports.ForbiddenError = ForbiddenError;
class InternalServerError extends app_exception_1.ApplicationError {
    constructor(message = "Internal Server Error", cause) {
        super(message, 500, { cause });
    }
}
exports.InternalServerError = InternalServerError;
class BadRequestError extends app_exception_1.ApplicationError {
    constructor(message = "Bad Request", cause) {
        super(message, 400, { cause });
    }
}
exports.BadRequestError = BadRequestError;
class ConflictError extends app_exception_1.ApplicationError {
    constructor(message = "Conflict", cause) {
        super(message, 409, { cause });
    }
}
exports.ConflictError = ConflictError;
class TooManyRequestsError extends app_exception_1.ApplicationError {
    constructor(message = "Too Many Requests", cause) {
        super(message, 429, { cause });
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
