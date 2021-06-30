require("dotenv").config();


const ClientError = require("../src/exceptions/ClientError");

const Hapi = require("@hapi/hapi");
const Jwt = require("@hapi/jwt");

const path = require("path");
const Inert = require("@hapi/inert");

const songs = require("./api/songs");
const SongsService = require("./services/postgres/SongsService");
const SongsValidator = require("./validator/songs");

const users = require("./api/users");
const UserService = require("./services/postgres/UserService");
const UsersValidator = require("./validator/users");

const authentications = require("./api/authentications");
const AuthenticationsService = require("./services/postgres/AuthenticationsService");
const TokenManager = require("./tokenize/TokenManager");
const AuthenticationsValidator = require("./validator/authentications");

const PlaylistsService = require("./services/postgres/PlaylistService");
const PlaylistsValidator = require("./validator/playlists");
const playlists = require("./api/playlists");

const PlaylistsSongService = require("./services/postgres/PlaylistSongService");
const PlaylistSongValidator = require("./validator/playlistsongs");
const playlistsong = require("./api/playlistsongs");

const collaborations = require("./api/collaborations");
const CollaborationsService = require("./services/postgres/CollaborationsService");
const CollaborationsValidator = require("./validator/collaborations");

const _exports = require("./api/exports");
const ProducerService = require("./services/rabbitmq/ProducerService");
const ExportsValidator = require("./validator/exports");

const uploads = require("./api/uploads");
const StorageService = require("./services/storage/StorageService");
const UploadsValidator = require("./validator/uploads");

const CacheService = require("./services/redis/CacheService");

const init = async () => {
  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService();
  const songsService = new SongsService();
  const usersService = new UserService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService = new PlaylistsService();
  const playlistSongService = new PlaylistsSongService(
    collaborationsService,
    cacheService
  );
  const storageService = new StorageService(
    path.resolve(__dirname, "api/uploads/file/images")
  );

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ["*"],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy("playlistsapp_jwt", "jwt", {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  server.ext("onPreResponse", (request, h) => {
    const { response } = request;
    if (response instanceof ClientError) {
      const newResponse = h.response({
        status: "fail",

        message: response.message,
      });

      newResponse.code(response.statusCode);

      return newResponse;
    }

    return response.continue || response;
  });

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistsong,
      options: {
        service: playlistSongService,
        validator: PlaylistSongValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authService: authenticationsService,
        service: usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistSongService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        service: ProducerService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        validator: UploadsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
