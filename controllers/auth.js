//auth para CRM-React 
const sql = require('mssql');
const config = require('../db/configDb');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('./validation');
const verify = require('./verifyToken');
const { v4: uuidv4 } = require("uuid");
const { DB_SERVER, PORT } = require('../db/conection');

exports.register = async (req, res) => {
    try {
        const { Name, Users,
            Email,
            LastName,
            Password,
            Rol,
            Currency,
            Symbol,
            Agrupation,
            SeparateDecimal,
            SeparaterGroups,
            CurrencySymbolPlace,
            DecimalsCamps,
            Position,
            Fax,
            Departmen,
            Email2, TelOffice, TelMovil, TelHome,
            InformTo, TelDirection, Firm, Documents,
            ClientEmailInter, Lenguage, CRMPhone,
            ViewRegisterDefect, Direction, Country,
            Municipality, PostalCode, State, Image } = req.body
        let { Admin } = req.body
        const Id = uuidv4()
        // Validate data before making a user
        const { error } = registerValidation({ Name, Users, Email, LastName, Password, Rol });
        if (error) return res.status(400).send(error.details[0].message);
        const connection = await sql.connect(config);
        // Checking if the user is already in the database
        const emailExist = await connection.request().input('Correo', Email).execute('SP_validarcorreo')
        if (emailExist.recordset.length > 0) return res.status(400).send('El email ya esta registrado');
        //token
        const token = jwt.sign({ id: Id }, process.env.TOKEN_SECRET);
        // Hash passwords
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(Password, salt);
        // Create a new user
        console.log(connection)
        const user = await connection.request()
            .input('id', Id)
            .input('Nombre', Name)
            .input('Usuario', Users)
            .input('Correo', Email)
            .input('Apellido', LastName)
            .input('Contraseña', hashedPassword)
            .input('id_rol', Rol)
            .input('Divisas', Currency)
            .input('Simbolo', Symbol)
            .input('Agrupacion', Agrupation)
            .input('SeparadorDecimales', SeparateDecimal)
            .input('SeparadorGrupos', SeparaterGroups)
            .input('Simbolodeladivisa', CurrencySymbolPlace)
            .input('DecimalesCampos', DecimalsCamps)
            .input('Posiciones', Position)
            .input('Fax', Fax)
            .input('Departamentos', Departmen)
            .input('Correo2', Email2)
            .input('TelefonoOficina', TelOffice)
            .input('TelefonoMovil', TelMovil)
            .input('TelefonoCasa', TelHome)
            .input('Informa', InformTo)
            .input('Telefonodirecto', TelDirection)
            .input('Firma', Firm)
            .input('Documentos', Documents)
            .input('CorreoInternos', ClientEmailInter)
            .input('Lenguaje', Lenguage)
            .input('ExtencionCrm', CRMPhone)
            .input('VistaDefecto', ViewRegisterDefect)
            .input('Direccion', Direction)
            .input('Ciudad', Country)
            .input('Municipio', Municipality)
            .input('CodigoPostal', PostalCode)
            .input('Estado', State)
            .input('Admin', Admin)
            .input('Imagen', Image)
            .execute('SP_nombreyquehace')
        res.header('auth-token', token).send({ ok: true });
    }
    catch (err) {
        console.log(err)
    }
}

exports.login = async (req, res) => {
    const { Email, Password } = req.body;
    const ok = false
    const connection = await sql.connect(config);
    // Validate data before making a user
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Checking if the email exists
    const user = await connection.query(`SELECT * FROM dbo.Tbl_User WHERE Email = '${Email}'`);
    if (user.recordset.length === 0) return res.status(400).send('No se encontro ningun usuario con ese correo');
    // Password is correct
    const validPass = await bcrypt.compare(Password, user.recordset[0].Password);
    if (!validPass) return res.status(400).send('Password invalido');

    // Create and assign a token
    const users = user.recordset[0]
    const token = jwt.sign({ id: user.recordset[0].Id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send({ token, users, ok: true });
}

exports.users = verify, async (req, res) => {
    const connection = await sql.connect(config);
    const users = await connection.query(`SELECT * FROM dbo.Tbl_User`);
    /* Quitar Password para no enviar al front y hacer el envio de los datos mas rapido */
    const usersWithoutPassword = users.recordset.map(user => {
        const { Password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    console.log(usersWithoutPassword)
    res.send(usersWithoutPassword);
}
exports.user = verify, async (req, res) => {
    const connection = await sql.connect(config);
    const id = req.params.id
    console.log(req.params)
    const user = await connection.request().input('id', id).execute('SP_buscarporid');
    console.log(user.recordset)
    res.send(user.recordset);
}

exports.updateUser = verify, async (req, res) => {
    const { Name, Users, Email, LastName, Password, Admin, Rol } = req.body
    const { error } = registerValidation({ Name, Users, Email, LastName, Password, Rol });
    console.log(error, "Error");
    if (error) return res.status(400).send(error.details[0].message);
    const user = await connection.query(`UPDATE dbo.Tbl_User SET Name = '${Name}', Users = '${Users}', Email = '${Email}', LastName = '${LastName}', Password = '${Password}', Admin = '${Admin}', Rol = '${Rol}' WHERE Id = '${req.params.id}'`);
    res.send(user);
}

exports.deleteUser = verify, async (req, res) => {
    const user = await connection.query(`DELETE FROM dbo.Tbl_User WHERE Id = '${req.params.id}'`);
    res.send(user);
}

exports.changePassword = async (req, res) => {
    const connection = await sql.connect(config);
    const { password,id } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await connection.request().input('id', id).input('password', hashedPassword).execute('SP_CambiarContraseña');
    res.send({message:'La contraseña se ha cambiado correctamente'});
}

exports.changeUsers = async (req,res) =>{
    const connection = await sql.connect(config);
    const {id,usuario, password} = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await connection.request().input('id',id).input('user',usuario).input('password',hashedPassword).execute('SP_CambiarUsuario');
    res.send({message:'El usuario se ha cambiado correctamente'});
}

exports.uploadimage = async (req, res) => {
    const imageUrl = `${DB_SERVER}:${PORT}/uploads/${req.file.originalname}`;
    res.send(imageUrl);
}

exports.getRole = async (req, res) => {
    const connection = await sql.connect(config);
    const rol = await connection.query(`SELECT * FROM dbo.C_Roles`);
    res.send(rol.recordset);
}