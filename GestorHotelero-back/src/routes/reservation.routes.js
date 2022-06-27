'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const reservationController = require('../controllers/reservation.controller');

//FUNCIONES PARA CLIENTE

api.post('/makeReservation', mdAuth.ensureAuth, reservationController.makeReservation);

//FUNCIONES PARA ADMINHOTEL

api.get('/getReservations', [mdAuth.ensureAuth, mdAuth.isAdminH], reservationController.getReservations);

//FUNCIONES PARA ADMINISTRADOR DE LA APLICACIÓN

api.get('/reservationsByHotel', [mdAuth.ensureAuth, mdAuth.isAdmin], reservationController.reservationsByHotel);

module.exports = api;