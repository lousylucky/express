const Joi = require('joi')
const mongoose = require('mongoose')
const { genresSchema } = require('./genre')

// Define Schema
const moviesSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        minlength: 3,
        maxlength: 50,
        required: true
    },
    numberInStock: Number,
    dailyRentalRate: Number,
    genre: {
        type: genresSchema,
        required: true
    }

})

function validateMovie(movie) {
    const schema = Joi.object({
        title: Joi.string()
            .min(3)
            .max(50)
            .required(),
        genreId: Joi.objectId()
            .required()
    })
    return schema.validate(movie);
}

// Define model
const Movie = mongoose.model('Movie', moviesSchema)

module.exports.Movie = Movie
module.exports.validate = validateMovie
module.exports.moviesSchema = moviesSchema