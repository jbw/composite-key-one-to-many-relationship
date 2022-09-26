import { Options, Utils } from '@mikro-orm/core';

const databaseOptions: Options = {
  strict: true,

  entitiesTs: ['src/**/*.entity.ts'],
  entities: ['dist/**/*.entity.js'],

  type: 'postgresql',
  host: 'localhost',
  dbName: 'composite-key-one-to-many-relationship-data',
  user: 'postgres',
  password: 'postgres',
  port: 5455,

  debug: true,

  forceEntityConstructor: true,
  forceUtcTimezone: true,

  migrations: {
    tableName: 'migrations',
    path: Utils.detectTsNode() ? './migrations' : './dist/migrations',
    transactional: true,
    allOrNothing: true,
    emit: 'ts',
    dropTables: false,
    safe: false,
  },
};

export default databaseOptions;
