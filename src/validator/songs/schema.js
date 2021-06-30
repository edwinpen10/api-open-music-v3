const Joi = require('joi');
 
const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().integer().min(1900).max(2021).required(),
  //performer: Joi.array().items(Joi.string()).required(),
  performer: Joi.string().required(),
  genre: Joi.string().required(),
  duration: Joi.number().required()
});

module.exports = { SongPayloadSchema };