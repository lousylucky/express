const Joi = require('joi')
const mongoose = require('mongoose')
const { customersSchema } = require('./customer')
const { Movie } = require('./movie')

// Define Schema
const rentSchema = new mongoose.Schema({
    customer: {
        type: customersSchema,
        required: true,
    },
    numberInStock: Number,
    dailyRentalRate: Number,
    movie: new mongoose.Schema({
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
    dateReturned: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }

})

rentSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}

rentSchema.methods.processRent = async function () {
    this.dateReturned = new Date()
    this.rentalFee = Math.floor((this.dateReturned - this.dateOut) / (1000 * 60 * 60 * 24)) * this.movie.dailyRentalRate
    await Movie.updateOne({ _id: this.movie._id }, {
        $inc: { numberInStock: 1 }
    })
    await this.save()
}

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