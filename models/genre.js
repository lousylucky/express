const Joi = require('joi')
const mongoose = require('mongoose')

// Define Schema
const genresSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['SF', 'romantic', 'dramat', 'thiller'],
        required: true
    }
})

// Define model
const Genre = mongoose.model('Genre', genresSchema)

function validateGenre(genre) {
    const schema = Joi.object({
        name: Joi.string()
            .alphanum()
            .min(2)
            .max(30)
            .required(),
    })
    return schema.validate(genre);
}


module.exports.Genre = Genre
module.exports.genresSchema = genresSchema
module.exports.validate = validateGenre