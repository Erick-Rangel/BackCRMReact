const dotenv = require('dotenv')
dotenv.config({
    path: './db/.env'
})

module.exports = {
    PORT: process.env.PORT || 3007,
    DB_SERVER: process.env.DB_SERVER,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS
}
