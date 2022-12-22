const ve = require('../db/conection');



const config = {
    user: ve.DB_USER,
    password: ve.DB_PASS,
    server: ve.DB_SERVER,
    database: ve.DB_NAME,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: true, // for azure
        trustServerCertificate: true // change to true for local dev / self-signed certs
    }
};


module.exports = config