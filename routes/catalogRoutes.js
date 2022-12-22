const express = require('express');
const catalogController = require('../controllers/Plantillas')
const router = express.Router();

router.get('/roles',catalogController.getRoles)

router.get('/users',catalogController.getUsers)

router.get('/user/:id',catalogController.getUser)


module.exports = router;

