const sql = require('mssql');
const config = require('../db/configDb');

exports.getRoles = async (req,res,next) => {
    try{
    const connection = await sql.connect(config);
    const roles = await connection.query(`SELECT * FROM dbo.C_Roles`);
    res.send(roles.recordset);
    }
    catch(err){
        console.log(err)
    }

}


exports.getUsers = async (req,res,next) => {
    try{
    const connection = await sql.connect(config);
    const users = await connection.query(`SELECT * FROM dbo.Tbl_User`);
    res.send(users.recordset);
    }
    catch(err){
        console.log(err)
    }
}

exports.getUser = async (req,res,next) => {
    const id = req.params.id;
    try{
    const connection = await sql.connect(config);
    const user = await connection.query(`SELECT * FROM dbo.Tbl_User WHERE Id = '${id}'`);
    res.send(user.recordset);
    }
    catch(err){
        console.log(err)
    }
}



