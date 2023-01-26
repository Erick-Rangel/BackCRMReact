const express = require('express');
const cors = require('cors');
const ve = require('./db/conection');
const register = require('./routes/authRoutes')
const catalog = require('./routes/catalogRoutes');
const bodyParser = require('body-parser');
const serveStatic = require('serve-static');
const path = require('path');
const importExport = require('./routes/importExportRoutes');

const app = express()   

app.use(express.static('public'))

//midlewares
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.json());
app.use(cors());
app.use(register,catalog,importExport)

//
// Start the server
//
var PORT = ve.PORT

app.listen(PORT, () => console.log('Server listening on port ' + PORT));

