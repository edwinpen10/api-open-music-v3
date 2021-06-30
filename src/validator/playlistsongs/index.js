const InvariantError = require('../../exceptions/InvariantError');
const {  PlaylistSongsPayloadSchema} = require('./schema');

const PlaylistSongsValidator = {
    validatePlaylistSongsPayload: (payload) => {
        const validationResult = PlaylistSongsPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
          }
    },
  };

  module.exports = PlaylistSongsValidator;