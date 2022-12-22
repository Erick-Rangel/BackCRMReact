"use strict";

//auth para CRM-React 
var sql = require('mssql');

var config = require('../db/configDb');

var jwt = require('jsonwebtoken');

var bcrypt = require('bcryptjs');

var _require = require('./validation'),
    registerValidation = _require.registerValidation,
    loginValidation = _require.loginValidation;

var verify = require('./verifyToken');

var _require2 = require("uuid"),
    uuidv4 = _require2.v4;

exports.register = function _callee(req, res) {
  var _req$body, Name, Users, Email, LastName, Password, Admin, Rol, Id, _registerValidation, error, connection, emailExist, salt, hashedPassword, user, token;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          console.log(req.body);
          _req$body = req.body, Name = _req$body.Name, Users = _req$body.Users, Email = _req$body.Email, LastName = _req$body.LastName, Password = _req$body.Password, Admin = _req$body.Admin, Rol = _req$body.Rol;
          Id = uuidv4; // Validate data before making a user

          _registerValidation = registerValidation({
            Name: Name,
            Users: Users,
            Email: Email,
            LastName: LastName,
            Password: Password,
            Rol: Rol
          }), error = _registerValidation.error;

          if (!error) {
            _context.next = 6;
            break;
          }

          return _context.abrupt("return", res.status(400).send(error.details[0].message));

        case 6:
          _context.next = 8;
          return regeneratorRuntime.awrap(sql.connect(config));

        case 8:
          connection = _context.sent;
          _context.next = 11;
          return regeneratorRuntime.awrap(connection.query("SELECT * FROM dbo.Tbl_User WHERE Email = '".concat(Email, "'")));

        case 11:
          emailExist = _context.sent;

          if (!(emailExist.recordset.length > 0)) {
            _context.next = 14;
            break;
          }

          return _context.abrupt("return", res.status(400).send('El email ya esta registrado'));

        case 14:
          _context.next = 16;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 16:
          salt = _context.sent;
          _context.next = 19;
          return regeneratorRuntime.awrap(bcrypt.hash(Password, salt));

        case 19:
          hashedPassword = _context.sent;
          _context.next = 22;
          return regeneratorRuntime.awrap(connection.query("INSERT INTO dbo.Tbl_User (\n        Name\n        , Users\n        , Email\n        , LastName\n        , Password\n        , Admin\n        , id_rol\n        , Id) VALUES (\n        '".concat(Name, "', \n        '").concat(Users, "',\n        '").concat(Email, "',\n        '").concat(LastName, "',\n        '").concat(hashedPassword, "',\n        '").concat(Admin, "',\n        '").concat(Rol, "',\n        '").concat(Id, "' )")));

        case 22:
          user = _context.sent;
          console.log(JSON.stringify(user));
          res.send(user); //token

          token = jwt.sign({
            id: Id
          }, process.env.TOKEN_SECRET);
          res.header('auth-token', token).send(token);

        case 27:
        case "end":
          return _context.stop();
      }
    }
  });
};

exports.login = function _callee2(req, res) {
  var _req$body2, Email, Password, ok, connection, _loginValidation, error, user, validPass, users, token;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, Email = _req$body2.Email, Password = _req$body2.Password;
          ok = false;
          _context2.next = 4;
          return regeneratorRuntime.awrap(sql.connect(config));

        case 4:
          connection = _context2.sent;
          // Validate data before making a user
          _loginValidation = loginValidation(req.body), error = _loginValidation.error;

          if (!error) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.status(400).send(error.details[0].message));

        case 8:
          _context2.next = 10;
          return regeneratorRuntime.awrap(connection.query("SELECT * FROM dbo.Tbl_User WHERE Email = '".concat(Email, "'")));

        case 10:
          user = _context2.sent;

          if (!(user.recordset.length === 0)) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", res.status(400).send('No se encontro ningun usuario con ese correo'));

        case 13:
          _context2.next = 15;
          return regeneratorRuntime.awrap(bcrypt.compare(Password, user.recordset[0].Password));

        case 15:
          validPass = _context2.sent;

          if (validPass) {
            _context2.next = 18;
            break;
          }

          return _context2.abrupt("return", res.status(400).send('Password invalido'));

        case 18:
          // Create and assign a token
          users = user.recordset[0];
          token = jwt.sign({
            id: user.recordset[0].Id
          }, process.env.TOKEN_SECRET);
          res.header('auth-token', token).send({
            token: token,
            users: users,
            ok: true
          });

        case 21:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.users = verify, function _callee3(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(connection.query('SELECT * FROM dbo.Tbl_User'));

        case 2:
          users = _context3.sent;
          res.send(users.recordset);

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
};
exports.users = verify, function _callee4(req, res) {
  var users;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(connection.query('SELECT * FROM dbo.Tbl_User'));

        case 2:
          users = _context4.sent;
          res.send(users.recordset);

        case 4:
        case "end":
          return _context4.stop();
      }
    }
  });
};
exports.user = verify, function _callee5(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(connection.query("SELECT * FROM dbo.Tbl_User WHERE Id = '".concat(req.params.id, "'")));

        case 2:
          user = _context5.sent;
          res.send(user.recordset);

        case 4:
        case "end":
          return _context5.stop();
      }
    }
  });
};
exports.updateUser = verify, function _callee6(req, res) {
  var _req$body3, Name, Users, Email, LastName, Password, Admin, Rol, _registerValidation2, error, user;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _req$body3 = req.body, Name = _req$body3.Name, Users = _req$body3.Users, Email = _req$body3.Email, LastName = _req$body3.LastName, Password = _req$body3.Password, Admin = _req$body3.Admin, Rol = _req$body3.Rol;
          _registerValidation2 = registerValidation({
            Name: Name,
            Users: Users,
            Email: Email,
            LastName: LastName,
            Password: Password,
            Rol: Rol
          }), error = _registerValidation2.error;

          if (!error) {
            _context6.next = 4;
            break;
          }

          return _context6.abrupt("return", res.status(400).send(error.details[0].message));

        case 4:
          _context6.next = 6;
          return regeneratorRuntime.awrap(connection.query("UPDATE dbo.Tbl_User SET Name = '".concat(Name, "', Users = '").concat(Users, "', Email = '").concat(Email, "', LastName = '").concat(LastName, "', Password = '").concat(Password, "', Admin = '").concat(Admin, "', Rol = '").concat(Rol, "' WHERE Id = '").concat(req.params.id, "'")));

        case 6:
          user = _context6.sent;
          res.send(user);

        case 8:
        case "end":
          return _context6.stop();
      }
    }
  });
};
exports.deleteUser = verify, function _callee7(req, res) {
  var user;
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(connection.query("DELETE FROM dbo.Tbl_User WHERE Id = '".concat(req.params.id, "'")));

        case 2:
          user = _context7.sent;
          res.send(user);

        case 4:
        case "end":
          return _context7.stop();
      }
    }
  });
};

exports.changePassword = function _callee8(req, res) {
  var Password, _loginValidation2, error, salt, hashedPassword, user;

  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          Password = req.body.Password;
          _loginValidation2 = loginValidation(req.body), error = _loginValidation2.error;

          if (!error) {
            _context8.next = 4;
            break;
          }

          return _context8.abrupt("return", res.status(400).send(error.details[0].message));

        case 4:
          _context8.next = 6;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 6:
          salt = _context8.sent;
          _context8.next = 9;
          return regeneratorRuntime.awrap(bcrypt.hash(Password, salt));

        case 9:
          hashedPassword = _context8.sent;
          _context8.next = 12;
          return regeneratorRuntime.awrap(connection.query("UPDATE dbo.Tbl_User SET Password = '".concat(hashedPassword, "' WHERE Id = '").concat(req.params.id, "'")));

        case 12:
          user = _context8.sent;
          res.send(user);

        case 14:
        case "end":
          return _context8.stop();
      }
    }
  });
};