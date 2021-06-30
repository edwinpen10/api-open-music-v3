const amqp = require('amqplib');
const { Pool } = require("pg");
const NotFoundError = require("../../exceptions/NotFoundError");
const AuthorizationError = require("../../exceptions/AuthorizationError");

const ProducerService = {
    

    sendMessage: async (queue, message) => {

        const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
        const channel = await connection.createChannel();

        await channel.assertQueue(queue, {
            durable: true,
          });

        await channel.sendToQueue(queue, Buffer.from(message));
          
        setTimeout(() => {
            connection.close();
          }, 1000);

    },

    async verifyPlaylistOwner(id, owner) {

        this._pool = new Pool();

        const query = {
          text: "SELECT * FROM playlists WHERE id = $1",
          values: [id],
        };
    
        const result = await this._pool.query(query);
    
        if (!result.rows.length) {
          throw new NotFoundError("Playlists tidak ditemukan");
        }
        const note = result.rows[0];
    
        if (note.owner !== owner) {
          throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
        }
      }
};

module.exports = ProducerService;