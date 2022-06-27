'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const roomController = require('../controllers/room.controller');

//RUTAS ADMINISTRADOR DE LA APLICACIÓN

api.post('/addRoom', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.addRoom);

//RUTAS CLIENTE

api.get('/getRooms/:id', mdAuth.ensureAuth, roomController.getRooms);
api.get('/availableRooms/:id', [mdAuth.ensureAuth, mdAuth.isAdminH], roomController.availableRooms);

module.exports = api;
