"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserReactionRepository = void 0;
const db_repository_1 = require("../../repository/db.repository");
const user_reaction_model_1 = require("./user-reaction.model");
class UserReactionRepository extends db_repository_1.AbstractDBRepository {
    constructor() {
        super(user_reaction_model_1.ReactionModel);
    }
}
exports.UserReactionRepository = UserReactionRepository;
