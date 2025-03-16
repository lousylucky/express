const express = require('express')
const auth = require('../middleware/auth')
const validator = require('../middleware/validator')
const router = express()
const { Rent, validate } = require('../models/rent')

router.post('/', [auth, validator(validate)], async (req, res) => {

    const rent = await Rent.lookup(req.body.customerId, req.body.movieId)

    if (!rent) return res.status(404).send('rent not found')
    if (rent.dateReturned) return res.status(400).send('rent already proccesed')

    await rent.processRent()
    return res.status(200).send(rent)
})



module.exports = router