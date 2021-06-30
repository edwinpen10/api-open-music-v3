const routes = (handler) => [
  {
    method: "POST",
    path: "/playlists/{playlistId}/songs",
    handler: handler.postPlaylistSongHandler,
    options: {
      auth: "playlistsapp_jwt",
    },
  },
  {
    method: "GET",
    path: "/playlists/{playlistId}/songs",
    handler: handler.getPlaylistSongHandler,
    options: {
      auth: "playlistsapp_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/playlists/{playlistId}/songs",
    handler: handler.deletePlaylistSongHandler,
    options: {
      auth: "playlistsapp_jwt",
    },
  },
];

module.exports = routes;
