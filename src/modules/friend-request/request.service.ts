import { Types } from "mongoose";
import { RequestRepository } from "../../DB/models/friend-request";
import { ConflictError, UnauthorizedError } from "../../common/exceptions";
import { UserFriendRepository } from "../../DB";

class RequestService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly userFriendRepository: UserFriendRepository,
  ) {}

  public sendRequest = async (
    userId: Types.ObjectId, //sender (logged user)
    receiverId: Types.ObjectId, //req params
  ) => {
    //TODO check if blocked user
    // check if already on friends list
    const friend = await this.userFriendRepository.findOne({
      $or: [
        { user: userId, friend: receiverId },
        { user: receiverId, friend: userId },
      ],
    });
    if (friend)
      throw new ConflictError("you are already friends with this user");
    //check if already sent a request (sender) , if already received an request (receiver)
    const request = await this.requestRepository.findOne({
      $or: [
        { sender: userId, receiver: receiverId },
        { sender: receiverId, receiver: userId },
      ],
    });
    if (request)
      throw new ConflictError(
        "cannot send request, already there is a request !",
      );
    // else send a new request
    //send notification
    return this.requestRepository.create({
      sender: userId,
      receiver: receiverId,
    });
  };
  public acceptRequest = async (userId: Types.ObjectId, id: Types.ObjectId) => {
    const request = await this.requestRepository.findOne({
      _id: id,
    });
    if (!request) throw new ConflictError("request not found");
    //check if logged user is the receiver of the request
    if (request.receiver.toString() !== userId.toString()) {
      throw new UnauthorizedError("you are not allowed to accept this request");
    }
    //only receiver can accept the request
    await this.requestRepository.deleteOne({ _id: id });

    await this.userFriendRepository.create({
      user: request.sender,
      friend: request.receiver,
    });
  };
}
export default new RequestService(
  new RequestRepository(),
  new UserFriendRepository(),
);
