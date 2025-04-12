const auth = require('../middleware/auth')
const mongoose = require('mongoose')
const express = require('express')
const router = express()
const { User, validate, validateUpdate } = require('../models/user')
const _ = require('lodash')
const bcrypt = require('bcrypt');

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password')
    res.send(user)
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.message)

    let user = await User.findOne({ email: req.body.email })
    if (user) return res.status(400).send("User already registered")

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    })

    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(user.password, salt)

    try {
        await user.save()
        const token = user.generateAuthToken()
        res.header('x-auth-token', token).send(_.pick(user, ['name', 'email']));
    } catch (error) {
        res.status(500).send(error.message);
    }
})

router.put('/:id', auth, async (req, res) => {

    const { error } = validateUpdate(req.body)
    if (error) return res.status(400).send(error)

    const result = await User.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        email: req.body.email,
    })

    if (!result) return res.status(404).send("user with given id not found")
    res.send("Success")

})

router.delete('/:id', auth, async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id).select('-password')
    if (!user) return res.status(404).send("user with given id not found")
    res.send(user)
})


module.exports = router