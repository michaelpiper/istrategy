import joi from 'joi'
export const storeValidation = joi.object({
  article: joi.allow(joi.string().uppercase().required(),joi.number().required()),
  provider: joi.allow(joi.string().required(),joi.number().required()),
  price: joi.number().required(),
})
export const updateValidation = joi.object({
  article: joi.allow(joi.string().uppercase(),joi.number()),
  provider: joi.allow(joi.string(),joi.number()),
  price: joi.number(),
})
