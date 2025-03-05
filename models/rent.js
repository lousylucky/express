const Joi = require('joi')
const mongoose = require('mongoose')
const { moviesSchema } = require('./movie')
const { customersSchema } = require('./customer')

// Define Schema
const rentSchema = new mongoose.Schema({
    customer: {
        type: customersSchema,
        required: true,
    },
    numberInStock: Number,
    dailyRentalRate: Number,
    movie:   new mongoose.Schema({
        title: {
            type: String,
            trim: true,
            minlength: 3,
            maxlength: 50,
            required: true
        },
        numberInStock: Number,
        dailyRentalRate: Number
    }),
    dateOut: {
        type: Date,
        default: Date.now

    },
    dateRetourned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }

})

function validateRent(rent) {
    const schema = Joi.object({
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    })
    return schema.validate(rent);
}

// Define model
const Rent = mongoose.model('Rent', rentSchema)

module.exports.Rent = Rent
module.exports.validate = validateRent