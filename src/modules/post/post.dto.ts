import z from "zod";

import * as validator from "./validation/post.validation";

export type CreatePostDTO = z.infer<typeof validator.createPostSchema.body>;
export type PostReactionDTO=z.infer<typeof validator.reactToPostSchema.body>