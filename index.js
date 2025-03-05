const Joi = require('joi')
const config = require('config')
Joi.objectId = require('joi-objectid')(Joi)
require('express-async-errors')
const winston = require('winston')
const express = require('express')
const mongoose = require('mongoose');
const genres = require('./routes/genres')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require('./routes/users')
const auth = require('./routes/auth')
const error = require('./middleware/error')

winston.add(new winston.transports.File({ filename: 'logfile.log' }))

if(!config.get('jwtPrivateKey')){
    console.error('FATAL ERROR: jwtPrivateKey is not defined')
    process.exit(1)
}

// Connection
mongoose.connect('mongodb://localhost/vindly')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Could not connecto MongoDb'))


const app = express()
app.use(express.json()) // Middleware do parsowania JSON
app.use('/api/genres/', genres)
app.use('/api/customers/', customers)
app.use('/api/movies/', movies)
app.use('/api/rentals/', rentals)
app.use('/api/users/', users)
app.use('/api/auth/', auth)

app.use(error)

app.listen(3000, () => console.log("Lisiting on port 3000"))

