'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const reservationController = require('../controllers/reservation.controller');

//FUNCIONES PARA CLIENTE

api.post('/makeReservation', mdAuth.ensureAuth, reservationController.makeReservation);
api.get('/getReservationsApproved', mdAuth.ensureAuth, reservationController.getReservationsApproved);
api.get('/getReservationsFinished', mdAuth.ensureAuth, reservationController.getReservationsFinished);
api.get('/cancelReservation/:idR', mdAuth.ensureAuth, reservationController.cancelReservation);

//FUNCIONES PARA ADMINHOTEL

api.get('/getReservations', [mdAuth.ensureAuth, mdAuth.isAdminH], reservationController.getReservations);
api.put('/updateReservation/:idR', [mdAuth.ensureAuth, mdAuth.isAdminH], reservationController.updateReservation);
api.delete('/deleteReservation/:idR', [mdAuth.ensureAuth, mdAuth.isAdminH], reservationController.deleteReservation);

//FUNCIONES PARA ADMINISTRADOR DE LA APLICACIÓN

api.get('/reservationsByHotel', [mdAuth.ensureAuth, mdAuth.isAdmin], reservationController.reservationsByHotel);

module.exports = api;