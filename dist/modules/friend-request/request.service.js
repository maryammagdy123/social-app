"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const friend_request_1 = require("../../DB/models/friend-request");
const exceptions_1 = require("../../common/exceptions");
class RequestService {
    requestRepository;
    constructor(requestRepository) {
        this.requestRepository = requestRepository;
    }
    sendRequest = async (userId, receiverId) => {
        const request = await this.requestRepository.findOne({
            $or: [
                { sender: userId, receiver: receiverId },
                { sender: receiverId, receiver: userId },
            ],
        });
        if (request)
            throw new exceptions_1.ConflictError("cannot send request, already there is a request !");
        return this.requestRepository.create({
            sender: userId,
            receiver: receiverId,
        });
    };
}
exports.default = new RequestService(new friend_request_1.RequestRepository());
