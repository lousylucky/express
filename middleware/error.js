const winston = require("winston")

module.exports = function(err, req, res, next) {
    console.error(err.message)
    winston.error(err.message)
    res.status(500).send('Something failed')
}  