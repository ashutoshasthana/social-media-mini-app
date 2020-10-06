import config from '../config/index';
import knex from 'knex';

const DB_DEV_ENV = require('./knexCon')[config.DB_ENV];

export default knex(DB_DEV_ENV);
