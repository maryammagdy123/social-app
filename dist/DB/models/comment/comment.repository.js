"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRepository = void 0;
const db_repository_1 = require("../../repository/db.repository");
const comment_model_1 = require("./comment.model");
class CommentRepository extends db_repository_1.AbstractDBRepository {
    constructor() {
        super(comment_model_1.CommentModel);
    }
}
exports.CommentRepository = CommentRepository;
