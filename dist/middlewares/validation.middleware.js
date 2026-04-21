"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validation = void 0;
const exceptions_1 = require("../common/exceptions");
const validation = (schema) => {
    return (req, res, next) => {
        const { error } = schema.safeParse(req.body);
        if (error) {
            throw new exceptions_1.ValidationError("Validation Error", {
                error: error.issues.map((issue) => ({
                    path: issue.path,
                    message: issue.message,
                })),
            });
        }
        next();
    };
};
exports.validation = validation;
