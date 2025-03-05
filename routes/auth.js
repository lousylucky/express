const express = require('express')
const router = express()
const { User } = require('../models/user')
const bcrypt = require('bcrypt');
const Joi = require('joi')


router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.message)

    let user = await User.findOne({ email: req.body.email })
    if (!user) return res.status(400).send("Invalid email or password")

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if(!validPassword) return res.status(400).send("Invalid email or password")

    const token = user.generateAuthToken()
    res.send(token)

})

function validate(req) {
    const schema = Joi.object({
        password: Joi.string().min(3).max(30).required(),
        email: Joi.string().min(3).max(255).required().email(),
    })
    return schema.validate(req);
}

module.exports = router