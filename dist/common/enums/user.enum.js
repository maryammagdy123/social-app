"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenderEnum = exports.ProviderEnum = exports.RoleEnum = void 0;
var RoleEnum;
(function (RoleEnum) {
    RoleEnum[RoleEnum["user"] = 0] = "user";
    RoleEnum[RoleEnum["admin"] = 1] = "admin";
})(RoleEnum || (exports.RoleEnum = RoleEnum = {}));
var ProviderEnum;
(function (ProviderEnum) {
    ProviderEnum[ProviderEnum["system"] = 0] = "system";
    ProviderEnum[ProviderEnum["google"] = 1] = "google";
})(ProviderEnum || (exports.ProviderEnum = ProviderEnum = {}));
var GenderEnum;
(function (GenderEnum) {
    GenderEnum[GenderEnum["male"] = 0] = "male";
    GenderEnum[GenderEnum["female"] = 1] = "female";
})(GenderEnum || (exports.GenderEnum = GenderEnum = {}));
