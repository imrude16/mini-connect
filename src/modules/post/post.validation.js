import Joi from "joi";

export const createPostSchema = Joi.object({
  caption: Joi.string().max(300).allow("")
});


