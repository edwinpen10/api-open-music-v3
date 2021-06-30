const PlaylistSongHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlistsong",
  version: "3.0.0",
  register: async (server, { service, validator }) => {
    const playlitsongHandler = new PlaylistSongHandler(service, validator);

    server.route(routes(playlitsongHandler));
  },
};
