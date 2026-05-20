"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userGQLSchema = void 0;
const user_resolver_1 = require("./user.resolver");
const user_types_gql_1 = require("./user.types.gql");
class UserGQLSchema {
    userResolver;
    constructor(userResolver) {
        this.userResolver = userResolver;
    }
    registerQuery() {
        return {
            getMyProfile: {
                type: user_types_gql_1.ProfileResponseType,
                description: "This query returns the profile of the currently authenticated user, including their basic information, posts, and friends. It requires authentication and will return an error if the user is not logged in.",
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
                resolve: async (parent, args, context) => {
                    return null;
                },
            },
            updateUser: {
                type: "User",
                args: {
                    id: { type: "ID" },
                    name: { type: "String" },
                    email: { type: "String" },
                },
                resolve: async (parent, args, context) => {
                    return null;
                },
            },
        };
    }
}
exports.userGQLSchema = new UserGQLSchema(user_resolver_1.userResolver);
