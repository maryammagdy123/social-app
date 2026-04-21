"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const db_repository_1 = require("../../repository/db.repository");
const user_model_1 = require("./user.model");
class UserRepository extends db_repository_1.AbstractDBRepository {
    constructor() {
        super(user_model_1.UserModel);
    }
}
exports.UserRepository = UserRepository;
