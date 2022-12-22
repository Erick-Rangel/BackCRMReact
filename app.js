const express = require('express');
const sql = require('mssql');
const app = express()   
const cors = require('cors');
const ve = require('./db/conection');
const register = require('./routes/authRoutes')
const catalog = require('./routes/catalogRoutes')


//midlewares
app.use(express.json());
app.use(cors());
app.use(register,catalog)


//
// Start the server
//
var PORT = ve.PORT

app.listen(PORT, () => console.log('Server listening on port ' + PORT));

