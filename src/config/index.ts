import { constants } from 'buffer';
import dotenv from 'dotenv';
import app_constant  from '../../app-constant';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || app_constant.DEVELOPMENT;

const envFound = dotenv.config({path: __dirname + '/.env'});
//console.log("Config : ",envFound);
if (envFound.error) {
  // This error should crash whole process
  throw new Error("Couldn't find .env file  ");
}

export default {
  /**
   * Your favorite port
   */
  port: parseInt(process.env.PORT),
  
  /**
   * That long string 
   */
  //dbURL: `mysql://${process.env.MYSQL_USERNAME}:${process.env.MYSQL_PASSWORD}@localhost:3306/${process.env.MYSQL_DB}`,
  dbURL:`${process.env.PDB_URL}`,
  DB_ENV:process.env.DB_ENV,
  /**
   * Your secret sauce
   */
  jwtSecret: process.env.JWT_SECRET,

  /**
   * Used by winston logger
   */
  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  /**
   * Agenda.js stuff
   */
  agenda: {
    dbCollection: process.env.AGENDA_DB_COLLECTION,
    pooltime: process.env.AGENDA_POOL_TIME,
    concurrency: parseInt(process.env.AGENDA_CONCURRENCY, 10),
  },

  /**
   * Agendash config
   */
  agendash: {
    user: 'agendash',
    password: '123456'
  },
  /**
   * API configs
   */
  api: {
    prefix: '/social',
  },
  /**
   * Mailgun email credentials
   */
  emails: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
  }
};
