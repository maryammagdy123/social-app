"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack);
    res
        .status(500)
        .json({
        message: err.message || "Internal Server Error",
        error: err,
        cause: err.cause || null,
        stack: err.stack || null,
    });
};
exports.globalErrorHandler = globalErrorHandler;
