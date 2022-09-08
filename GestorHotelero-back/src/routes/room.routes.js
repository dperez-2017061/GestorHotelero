'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const roomController = require('../controllers/room.controller');

//RUTAS PARA ADMINISTRADOR DE LA APLICACIÓN

api.post('/addRoom', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.addRoom);
api.put('/updateRoom/:idRo', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.updateRoom);
api.delete('/deleteRoom/:idRo', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.deleteRoom);
api.get('/getRoom/:idRo', mdAuth.ensureAuth, roomController.getRoom);
api.get('/getRooms', [mdAuth.ensureAuth, mdAuth.isAdmin], roomController.getRooms);

//RUTAS PARA CLIENTE

api.get('/getRoomsC/:idH', mdAuth.ensureAuth, roomController.getRoomsC);

//FUNCIONES PARA ADMINISTRADOR DEL HOTEL

api.get('/availableRooms', [mdAuth.ensureAuth, mdAuth.isAdminH], roomController.availableRooms);

module.exports = api;
