'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const roomController = require('../controllers/room.controller');

//RUTAS ADMINISTRADOR DE LA APLICACIÓN

api.post('/addRoom', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.addRoom);

//RUTAS PARA CLIENTE

api.get('/getRooms/:idH', mdAuth.ensureAuth, roomController.getRooms);
api.get('/availableRooms/:idH', [mdAuth.ensureAuth, mdAuth.isAdminH], roomController.availableRooms);

module.exports = api;
