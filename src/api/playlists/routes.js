const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists",
    handler: handler.postPlaylistsHandler,
    options: {
      auth: "playlistsapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists",
    handler: handler.getPlaylistsHandler,
    options: {
      auth: "playlistsapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{id}",
    handler: handler.deletePlaylistByIdHandler,
    options: {
      auth: "playlistsapp_jwt",
    },
  },
];

module.exports = routes;
