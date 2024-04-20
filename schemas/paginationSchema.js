import Joi from "joi";

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  favorite: Joi.string().valid("true", "false").optional(),
});

export default paginationSchema;
