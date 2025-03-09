const mongoose = require('mongoose');
const logger = require('./logger')

module.exports = function connect(){
    return mongoose.connect('mongodb://localhost/vindly')
        .then(() => logger.info('Connected to MongoDB'))
}