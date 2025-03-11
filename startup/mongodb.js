const mongoose = require('mongoose');
const logger = require('./logger')
const config = require('config')

module.exports = function connect(){
    const db= config.get('db')
    return mongoose.connect(db)
        .then(() => logger.info(`Connected to ${db}`))
}