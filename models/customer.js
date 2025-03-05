const Joi = require('joi')
const mongoose = require('mongoose')

// Define Schema
const customersSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    },
    isGold: {
        type: Boolean,
        default: false,
        required: true
    },
    phone: {
        type: String,
        maxlength: 12,
    }
})

function validateCustomer(customer) {
    const schema = Joi.object({
        phone: Joi.string()
            .min(6)
            .max(10)
            .required()
            .regex(/^[0-9]{6,10}$/)
            .message("Must be a number and contain max 10 numbers"),
        name: Joi.string()
            .min(3)
            .max(30)
            .required(),
        isGold: Joi.boolean()
            .required()
    })
    return schema.validate(customer);
}

// Define model
const Customer = mongoose.model('Customer', customersSchema)

module.exports.Customer = Customer
module.exports.validate = validateCustomer
module.exports.customersSchema = customersSchema
