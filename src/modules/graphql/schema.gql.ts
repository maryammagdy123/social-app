import { GraphQLObjectType, GraphQLSchema } from "graphql/type";
import { userGQLSchema } from "../user";

const query = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    ...userGQLSchema.registerQuery(),
  },
});
//define GraphQL schema
export let schema = new GraphQLSchema({ query });
