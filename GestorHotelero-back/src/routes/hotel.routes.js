'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const hotelController = require('../controllers/hotel.controller');

//FUNCIONES PARA ADMINISTRADOR DE LA APLICACIÓN

api.post('/createHotel', [mdAuth.ensureAuth, mdAuth.isAdmin], hotelController.createHotel);

//FUNCIONES PARA CLIENTE

api.get('/getHotel/:idH', hotelController.getHotel);

//FUNCIONES PÚBLICAS

api.get('/getHotels', hotelController.getHotels);
api.post('/searchHotelByName', mdAuth.ensureAuth, hotelController.searchHotelByName);
api.post('/searchHotelByAddress', mdAuth.ensureAuth, hotelController.searchHotelByAddress);

module.exports = api;
