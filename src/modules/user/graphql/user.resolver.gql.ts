import { userService, UserService } from "../user.service";

export class UserResolver {
  constructor(private readonly userService: UserService) {}

  //make all resolvers arrow functions to bind this to the class instance
  getMyProfile = async (parent: unknown, args: any, context: any) => {
    //logic
    const profile = await this.userService.myProfile(context.userId);
    return profile;
  }
}
export const userResolver = new UserResolver(userService);
//act as controller for GraphQL requests related to user, it will call the service methods and return the response to the client
