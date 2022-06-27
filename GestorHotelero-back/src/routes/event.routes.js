'use strict'

const express = require('express');
const api = express.Router();
const mdAuth = require('../services/authenticated');
const eventController = require('../controllers/event.controller');

//FUNCIONES PARA ADMINHOTEL

api.post('/createEvent', [mdAuth.ensureAuth, mdAuth.isAdminH], eventController.createEvent);

//FUNCIONES PARA CLIENTE

api.get('/getEvents/:idH', mdAuth.ensureAuth, eventController.getEvents);

module.exports = api;