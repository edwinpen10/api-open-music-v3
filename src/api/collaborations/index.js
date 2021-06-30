const CollaborationsHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'collaborations',
  version: '3.0.0',
  register: async (server, { collaborationsService, playlistSongService, validator }) => {
    const collaborationsHandler = new CollaborationsHandler(
      collaborationsService, playlistSongService, validator,
    );
    server.route(routes(collaborationsHandler));
  },
};