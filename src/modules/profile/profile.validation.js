import Joi from "joi";

/*
  This schema validates profile data sent by user
*/
export const profileSchema = Joi.object({
  fullName: Joi.string().min(3).required(),

  dob: Joi.date().required(),

  mobile: Joi.string().min(10).max(15).required(),

  address: Joi.object({
    landmark: Joi.string().allow(""),
    area: Joi.string().allow(""),
    pincode: Joi.string().allow(""),
    city: Joi.string().allow(""),
    state: Joi.string().allow("")
  }),

  bio: Joi.string().max(100).required()
});
