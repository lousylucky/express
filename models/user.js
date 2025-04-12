const Joi = require('joi')
const mongoose = require('mongoose')
const { customersSchema } = require('./customer')
const jwt = require('jsonwebtoken')
const config = require('config')
// instresting to install join password complexity
// npm i joi-password-complexity

// Define Schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 30,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 1024,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
    return token
}

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(255).required().email(),
        password: Joi.string().min(3).max(1024).required()
    })
    return schema.validate(user);
}
function validateUserUpdate(user) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(255).required().email(),
    })
    return schema.validate(user);
}

// Define model
const User = mongoose.model('User', userSchema)

module.exports.User = User
module.exports.validate = validateUser
module.exports.validateUpdate = validateUserUpdate