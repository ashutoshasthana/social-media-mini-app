// App entry point
import 'reflect-metadata';
import config from './config';
import express from 'express';
import routes from './api/index';
//import Logger from './loaders/logger';

async function startServer() {
    const app = express(); 
 
  //app.use(config.api.prefix,routes());
  await require('./loaders').default({ expressApp: app });
   app.listen(config.port,()=>{
    console.log("Server Running on : ",process.env.PORT);
    });
  }
  startServer();