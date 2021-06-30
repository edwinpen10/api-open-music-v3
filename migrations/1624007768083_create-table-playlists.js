/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('playlists', {
        id: {
          type: 'VARCHAR(50)',
          primaryKey: true,
        },
        name: {
          type: 'VARCHAR(50)',
          notNull: true,
        },
        created_at: {
            type: 'TEXT',
            notNull: true,
          },
          updated_at: {
            type: 'TEXT',
            notNull: true,
          },
      });
};

exports.down = pgm => {
    pgm.dropTable('playlists');
};
