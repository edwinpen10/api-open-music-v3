const InvariantError = require('../../exceptions/InvariantError');
const {  PlaylistPayloadSchema} = require('./schema');

const PlaylistsValidator = {
    validatePlaylistsPayload: (payload) => {
        const validationResult = PlaylistPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
          }
    },
  };

  module.exports = PlaylistsValidator;