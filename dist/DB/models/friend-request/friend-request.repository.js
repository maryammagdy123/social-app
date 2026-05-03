"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestRepository = void 0;
const db_repository_1 = require("../../repository/db.repository");
const friend_request_model_1 = require("./friend-request.model");
class RequestRepository extends db_repository_1.AbstractDBRepository {
    constructor() {
        super(friend_request_model_1.RequestModel);
    }
}
exports.RequestRepository = RequestRepository;
