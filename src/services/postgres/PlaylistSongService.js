const { Pool } = require("pg");
const { nanoid } = require("nanoid");
const InvariantError = require("../../exceptions/InvariantError");
const { mapDBToModel } = require("../../utils");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");
const ClientError = require("../../exceptions/ClientError");

class PlaylistSongService {
  constructor(collaborationService, cacheService) {
    this._pool = new Pool();
    this._collaborationService = collaborationService;
    this._cacheService = cacheService;
  }

  async addSongPlaylist({ playlistId, songId }) {
    const id = `${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: "INSERT INTO playlistsongs VALUES($1, $2, $3, $4, $5) RETURNING id",
      values: [id, playlistId, songId, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);
    if (!result.rows[0].id) {
      throw new InvariantError("Lagu gagal ditambahkan");
    }
    await this._cacheService.delete(`playlist:${id}`);
    return result.rows[0].id;
  }

  async verifyNewSongPlaylists(song_id, playlist_id) {
    const query = {
      text: "SELECT song_id FROM playlistsongs WHERE song_id = $1 and playlist_id = $2",
      values: [song_id, playlist_id],
    };

    const result = await this._pool.query(query);

    if (result.rows.length > 0) {
      throw new InvariantError(
        `Gagal menambahkan lagu. Lagu ini sudah didalam playlists.`
      );
    }
  }

  async verifyPlaylistSongOwner(playlistId, owner) {
    const query = {
      text: "SELECT * FROM playlists WHERE id = $1",
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError("Playlists tidak ditemukan");
    }
    const playlist = result.rows[0];

    if (playlist.owner !== owner) {
      throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
    }
  }

  async getPlaylistSong(id) {
    try {
      
      const result = await this._cacheService.get(`playlist:${id}`);
      return JSON.parse(result);
      
    } catch (error) {
        const query = {
          text: `SELECT songs.id, songs.title, songs.performer FROM playlistsongs, songs
          WHERE songs.id = playlistsongs.song_id and playlistsongs.playlist_id = $1`,
          values: [id],
        };
    
        const result = await this._pool.query(query);
        const mappedResult = result.rows.map(mapDBToModel);
        await this._cacheService.set(`playlist:${id}`, JSON.stringify(mappedResult));
        return mappedResult;
      }
    }
  

  async deletePlaylistSong(id, songId) {
    const query = {
      text: "DELETE FROM playlistsongs WHERE playlist_id = $1 and song_id =$2 RETURNING id",
      values: [id, songId],
    };
    
    const result = await this._pool.query(query);
    await this._cacheService.delete(`playlist:${id}`);
    
    if (!result.rows.length) {
      throw new ClientError("Lagu gagal dihapus. Id tidak ditemukan");
    }

  }

  async verifyPlaylistSongAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistSongOwner(playlistId, userId);
    } catch (error) {
      try {
        await this._collaborationService.verifyCollaborator(playlistId, userId);
      } catch {
        throw error;
      }
    }
  }
}

module.exports = PlaylistSongService;
