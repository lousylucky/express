const auth = require('../middleware/auth')
const mongoose = require('mongoose')
const express = require('express')
const router = express()
const { User, validate } = require('../models/user')
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

router.put('/:id', async (req, res) => {

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error)

    const rent = await Rent.findByIdAndUpdate(req.params.id, { name: req.body.name })
    if (!rent) return res.status(404).send("rent with given id not found")
    res.send("Success")

})

router.delete('/', async (req, res) => {
    const rent = await Rent.findByIdAndDelete(req.params.id)
    if (!rent) return res.status(404).send("rent with given id not found")
    res.send(rent)
})


module.exports = router