const mongoose = require('mongoose')
const express = require('express')
const router = express()
const { Rent, validate } = require('../models/rent')
const { Customer, } = require('../models/customer')
const { Movie } = require('../models/movie')
const Fawn = require('fawn')
const auth = require('../middleware/auth')



router.get('/', auth, async (req, res) => {
    return res.send(await Rent.find().sort('-dateOut'))
})

Fawn.init('mongodb://localhost/vindly')


router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.message)

    const movie = await Movie.findById(req.body.movieId)
    if (!movie) return res.status(400).send('Invalid movie.')

    const customer = await Customer.findById(req.body.customerId)
    if (!customer) return res.status(400).send('Invalid customer.')

    if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.')

    const rent = new Rent({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    })

    try {
        rent.save()
        movie.numberInStock--
        movie.save()

        res.send(rent);
    } catch (error) {
        res.status(500).send(error.message);
    }

})


router.delete('/:id', auth, async (req, res) => {
    const rent = await Rent.findByIdAndDelete(req.params.id)
    if (!rent) return res.status(404).send("rent with given id not found")
    res.send(rent)
})

router.get('/:id', auth, async (req, res) => {
    const rent = await Rent.findById(req.params.id)
    if (!rent) return res.status(404).send("rent with given id not found")
    res.send(rent)
})


module.exports = router