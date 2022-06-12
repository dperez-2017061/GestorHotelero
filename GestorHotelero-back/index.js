'use strict'

const mongoConfigs = require('./configs/mongoConfigs');
const app = require('./configs/app');


mongoConfigs.init();
app.initServer();