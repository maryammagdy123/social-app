"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailEnum = void 0;
var EmailEnum;
(function (EmailEnum) {
    EmailEnum["CONFIRM_EMAIL"] = "Email Confirmation Code";
    EmailEnum["FORGOT_PASSWORD"] = "Forgot Password Code";
    EmailEnum["RESET_PASSWORD"] = "Reset Password Code";
    EmailEnum["LOGIN"] = "2-Factor-Authentication Code";
})(EmailEnum || (exports.EmailEnum = EmailEnum = {}));
