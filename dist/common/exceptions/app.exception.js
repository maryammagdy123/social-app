"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApplicationError = void 0;
class ApplicationError extends Error {
    statusCode;
    constructor(message, statusCode, cause) {
        super(message, { cause });
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, new.target.prototype);
        this.name = this.constructor.name;
        Error.captureStackTrace?.(this, this.constructor);
    }
}
exports.ApplicationError = ApplicationError;
