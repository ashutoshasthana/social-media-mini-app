import config from '../config/index';


module.exports = {
    //development environment variable configuration
    development: {    
        client: 'postgres',
        connection: config.dbURL,
        pool: {
          min: 2,
          max: 10
        },
        
        migrations: {
          tableName: 'knex_migrations'
        }      
        },
      
    //staging environment variable configuration
    staging: {    
        client: 'postgresql',    
        connection: config.dbURL, 
        pool: {
          min: 2,
          max: 10
        },
        
        migrations: {
        tableName: 'knex_migrations'
        }
    },    
      
    //production environment variable configuration
    production: {        
        client: 'postgresql',        
        connection: process.env.DATABASE_URL+'?ssl=true&sslmode=require',
        pool: {
          min: 2,
          max: 10
        },        
        migrations: {
          tableName: 'knex_migrations'
        }  
        }
    };

