const mongoose = require('mongoose')
const express = require('express')
const router = express()
const { Movie, validate } = require('../models/movie')
const { Genre, } = require('../models/genre')

router.get('/', async (req, res) => {
    return res.send(await Movie.find().sort('name'))
})

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.message)

    const genre = await Genre.findById(req.body.genreId)
    if (!genre) return res.status(400).send('Invalid genre.')

    const movie = new Movie({
        title: req.body.title,
        numberInStock: 0,
        dailyRentalRate: 0,
        genre: {
            _id: genre._id,
            name: genre.name
        }
    })

    try {
        const result = await movie.save()
        res.send(result)
    } catch (error) {
        res.status(404).send('Could not save in the database')
    }

})

router.put('/:id', async (req, res) => {

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error)

    const movie = await Movie.findByIdAndUpdate(req.params.id, { name: req.body.name })
    if (!movie) return res.status(404).send("movie with given id not found")
    res.send("Success")

})


router.delete('/', async (req, res) => {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(404).send("movie with given id not found")
    res.send(movie)
})

router.get('/:id', async (req, res) => {
    const movie = await Movie.findById(req.params.id)
    if (!movie) return res.status(404).send("movie with given id not found")
    res.send(movie)
})


module.exports = router