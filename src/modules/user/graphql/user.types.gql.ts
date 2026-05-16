// here define the types for the user module

import {
  GraphQLObjectType,
  GraphQLList,
} from "graphql";

export const ProfileResponseType = new GraphQLObjectType({
  name: "ProfileResponse",
  fields: {
    userProfile: {
      type: UserType,
    },

    posts: {
      type: new GraphQLList(PostType),
    },

    friends: {
      type: new GraphQLList(UserType),
    },
  },
});