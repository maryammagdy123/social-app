"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const friend_request_1 = require("../../DB/models/friend-request");
const exceptions_1 = require("../../common/exceptions");
const DB_1 = require("../../DB");
class RequestService {
    requestRepository;
    userFriendRepository;
    constructor(requestRepository, userFriendRepository) {
        this.requestRepository = requestRepository;
        this.userFriendRepository = userFriendRepository;
    }
    sendRequest = async (userId, receiverId) => {
        const friend = await this.userFriendRepository.findOne({
            $or: [
                { user: userId, friend: receiverId },
                { user: receiverId, friend: userId },
            ],
        });
        if (friend)
            throw new exceptions_1.ConflictError("you are already friends with this user");
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
    acceptRequest = async (userId, id) => {
        const request = await this.requestRepository.findOne({
            _id: id,
        });
        if (!request)
            throw new exceptions_1.ConflictError("request not found");
        if (request.receiver.toString() !== userId.toString()) {
            throw new exceptions_1.UnauthorizedError("you are not allowed to accept this request");
        }
        await this.requestRepository.deleteOne({ _id: id });
        await this.userFriendRepository.create({
            user: request.sender,
            friend: request.receiver,
        });
    };
}
exports.default = new RequestService(new friend_request_1.RequestRepository(), new DB_1.UserFriendRepository());
