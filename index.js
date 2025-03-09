const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
require('express-async-errors')
const express = require('express')
const app = express()

// Local dependencies 
const logger = require('./startup/logger')
require('./startup/config')()
require('./startup/routes')(app)
require('./startup/mongodb')()

app.listen(3000, () => logger.info("Lisiting on port 3000"))

