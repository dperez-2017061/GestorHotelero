'use strict'

const express = require('express');
const api = express.Router();
const userController = require('../controllers/user.controller');
const mdAuth = require('../services/authenticated');

//RUTAS PÚBLICAS
api.post('/register', userController.register);
api.post('/login', userController.login);

//RUTAS PARA CLIENTE

api.put('/update/:id', mdAuth.ensureAuth, userController.update);
api.delete('/delete/:id', mdAuth.ensureAuth, userController.delete);

//RUTAS PARA ADMINISTRADOR DE LA APLICACIÓN

api.get('/getUsers', [mdAuth.ensureAuth, mdAuth.isAdmin], userController.getUsers);

//FUNCIONES PARA ADMINISTRADOR DEL HOTEL

api.post('/searchGuest', [mdAuth.ensureAuth, mdAuth.isAdminH], userController.searchGuest);

module.exports = api;
