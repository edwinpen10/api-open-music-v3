const ClientError = require("../../exceptions/ClientError");

class PlaylistSongtHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postPlaylistSongHandler = this.postPlaylistSongHandler.bind(this);
    this.getPlaylistSongHandler = this.getPlaylistSongHandler.bind(this);
    this.deletePlaylistSongHandler = this.deletePlaylistSongHandler.bind(this);
  }

  async postPlaylistSongHandler(request, h) {
    try {
      this._validator.validatePlaylistSongsPayload(request.payload);
      const { id: credentialId } = request.auth.credentials;
      const { songId = "untitled" } = request.payload;
      const { playlistId } = request.params;

      await this._service.verifyPlaylistSongAccess(playlistId, credentialId);
      await this._service.verifyNewSongPlaylists(songId, playlistId);
      const playlistid = await this._service.addSongPlaylist({
        playlistId,
        songId,
      });

      const response = h.response({
        status: "success",
        message: "Lagu berhasil ditambahkan",
        data: {
          playlistid,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async getPlaylistSongHandler(request, h) {
    try {
      const { playlistId } = request.params;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistSongAccess(playlistId, credentialId);
      const songs = await this._service.getPlaylistSong(playlistId);

      return {
        status: "success",
        data: {
          songs,
        },
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  async deletePlaylistSongHandler(request, h) {
    try {
      const { playlistId } = request.params;

      const { songId = "untitled" } = request.payload;
      const { id: credentialId } = request.auth.credentials;

      await this._service.verifyPlaylistSongAccess(playlistId, credentialId);
      await this._service.deletePlaylistSong(playlistId, songId);
      return {
        status: "success",
        message: "Lagu berhasil dihapus dari playlist",
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: "fail",
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      // Server ERROR!
      const response = h.response({
        status: "error",
        message: "Maaf, terjadi kegagalan pada server kami.",
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = PlaylistSongtHandler;
