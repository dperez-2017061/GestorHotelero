'use strict'

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

exports.initServer = ()=> app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});