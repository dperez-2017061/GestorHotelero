'use strict'

const userRoutes = require('../src/routes/user.routes');
const hotelRoutes = require('../src/routes/hotel.routes');

const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 5000 || process.env;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors());
app.use('/user', userRoutes);
app.use('/hotel', hotelRoutes);

exports.initServer = ()=> app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});