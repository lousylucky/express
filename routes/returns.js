const express = require('express')
const auth = require('../middleware/auth')
const router = express()
const {Rent} = require('../models/rent')

router.post('/', auth, async (req, res) => {
    if (!req.body.customerId) return res.status(400).send('customerId not provided')
    if (!req.body.movieId) return res.status(400).send('customerId not provided')

        const rent = await Rent.findOne({
            'customer._id': req.body.customerId,
            'movie._id': req.body.movieId
        });
    
    
    if (!rent) return res.status(404).send('rent not found')
    if(rent.dateReturned) return res.status(400).send('rent already proccesed')

    rent.dateReturned = new Date()
    rent.rentalFee = Math.floor((rent.dateReturned - rent.dateOut) / (1000 * 60 * 60 * 24)) * rent.movie.dailyRentalRate
    await rent.save()
    return res.status(200).send('Success')
})



module.exports = router