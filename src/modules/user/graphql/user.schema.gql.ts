import { GraphQLString } from "graphql";
import { userResolver, UserResolver } from "./user.resolver.gql";
class UserGQLSchema {
  constructor(private readonly userResolver: UserResolver) {}

  registerQuery() {
    return {
      getMyProfile: {
        type: GraphQLString,
        description:
          "This query returns the profile of the currently authenticated user, including their basic information, posts, and friends. It requires authentication and will return an error if the user is not logged in.",
        resolve: this.userResolver.getMyProfile,
      },
    };
  }

  registerMutation() {
    return {
      createUser: {
        type: "User",
        args: {
          name: { type: "String" },
          email: { type: "String" },
          password: { type: "String" },
        },
        resolve: async (parent: any, args: any, context: any) => {
          // Implement the logic to create a new user
          return null; // Return the created user object
        },
      },
      updateUser: {
        type: "User",
        args: {
          id: { type: "ID" },
          name: { type: "String" },

          email: { type: "String" },
        },
        resolve: async (parent: any, args: any, context: any) => {
          // Implement the logic to update an existing user
          return null; // Return the updated user object
        },
      },
    };
  }
}
export const userGQLSchema = new UserGQLSchema(userResolver);
