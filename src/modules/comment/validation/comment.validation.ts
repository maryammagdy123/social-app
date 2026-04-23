import { Types } from "mongoose";
import z from "zod";

export const addCommentSchema = {
  body: z
    .strictObject({
      content: z.string().trim().min(1).optional(),
      attachment: z.string().url().optional(),
      mentions: z
        .array(
          z
            .string()
            .refine((val) => Types.ObjectId.isValid(val))
            .transform((val) => new Types.ObjectId(val)),
        )
        .optional(),
    })
    .refine((data) => data.content || data.attachment, {
      message: "Comment cannot be empty",
    }),
};
