import { REACTION_ENUM } from './../../../common/enums/reaction.enum';
import z from "zod";
import { ValidationError } from "../../../common/exceptions";

export const createPostSchema = {
  body: z
    .strictObject({
      content: z.string().optional(),
      attachments: z.array(z.string()).optional(),
    })
    .refine((data) => {
      const { attachments, content } = data;
      if (!content && (!attachments || attachments.length === 0)) {
        throw new ValidationError("Post can not be empty!");
      }
      return true;
    }),
};

export const reactToPostSchema={
  body:z.strictObject({
    postId:z.string(),
    type:z.enum(REACTION_ENUM)
  })
}