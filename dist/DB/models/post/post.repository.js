"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRepository = void 0;
const db_repository_1 = require("../../repository/db.repository");
const post_model_1 = require("./post.model");
class PostRepository extends db_repository_1.AbstractDBRepository {
    constructor() {
        super(post_model_1.PostModel);
    }
}
exports.PostRepository = PostRepository;
