//auth para CRM-React 
const sql = require('mssql');
const config = require('../db/configDb');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('./validation');
const verify = require('./verifyToken');
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res) => {
    try{
    const { Name, Users, Email, LastName, Password,  Rol } = req.body
    let { Admin } = req.body
    const Id = uuidv4()
    // Validate data before making a user
    const { error } = registerValidation({ Name, Users, Email, LastName, Password, Rol });
    if (error) return res.status(400).send(error.details[0].message);
    const connection = await sql.connect(config);
    // Checking if the user is already in the database
    const emailExist = await connection.query(`SELECT * FROM dbo.Tbl_User WHERE Email = '${Email}'`);
    if (emailExist.recordset.length > 0) return res.status(400).send('El email ya esta registrado');
 //token
 const token = jwt.sign({ id: Id }, process.env.TOKEN_SECRET);
    // Hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);

    let rol = Number(Rol)

    if(Admin === true){
        Admin = 1
    }else{
        Admin = 0
    }

    // Create a new user
    const user = await connection.query(`INSERT INTO dbo.Tbl_User (
        Name
        , Users
        , Email
        , LastName
        , Password
        , Admin
        , id_rol
        , Id) VALUES (
        '${Name}', 
        '${Users}',
        '${Email}',
        '${LastName}',
        '${hashedPassword}',
        '${Admin}',
        '${rol}',
        '${Id}' )`)
        res.header('auth-token', token).send({ token, Name,LastName,Users,Id,Admin,rol, ok: true });
    }
    catch(err){
        console.log(err)
    }
}

exports.login = async (req, res) => {
    const { Email, Password } = req.body;
    console.log(Email, Password)
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


/* 
exports.user = verify, async (req, res) => {
    const user = await connection.query(`SELECT * FROM dbo.Tbl_User WHERE Id = '${req.params.id}'`);
    res.send(user.recordset);
}

exports.updateUser = verify, async (req, res) => {
    const { Name, Users, Email, LastName, Password, Admin, Rol } = req.body
    const { error } = registerValidation({ Name, Users, Email, LastName, Password, Rol });
    console.log(error,"Error");
    if (error) return res.status(400).send(error.details[0].message);
    const user = await connection.query(`UPDATE dbo.Tbl_User SET Name = '${Name}', Users = '${Users}', Email = '${Email}', LastName = '${LastName}', Password = '${Password}', Admin = '${Admin}', Rol = '${Rol}' WHERE Id = '${req.params.id}'`);
    res.send(user);
}

exports.deleteUser = verify, async (req, res) => {
    const user = await connection.query(`DELETE FROM dbo.Tbl_User WHERE Id = '${req.params.id}'`);
    res.send(user);
}

exports.changePassword = async (req, res) => {
    const { Password } = req.body;
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(Password, salt);
    const user = await connection.query(`UPDATE dbo.Tbl_User SET Password = '${hashedPassword}' WHERE Id = '${req.params.id}'`);
    res.send(user);
}
 */
