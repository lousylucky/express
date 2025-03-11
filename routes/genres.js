const express = require('express')
const router = express()
const {Genre, validate} = require('../models/genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')
const logger = require('../startup/logger')

router.get('/', async (req, res) => {
    logger.log('info', `Getting all genres - User: ${req.user ? req.user._id : 'Anonymous'}, URL: ${req.originalUrl}, IP: ${req.ip}`)
    return res.send(await Genre.find().sort('name'))
})

router.post('/', auth, async (req, res) => {     

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.message)

    const genre = new Genre({ name: req.body.name })

    try {
        const result = await genre.save()
        res.send(result)
    } catch (error) {
        res.status(404).send('Could not save in the database')
    }

})

router.put('/:id', async (req, res) => {

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error)

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name })
    if (!genre) return res.status(404).send("Genre with given id not found")
    res.send("Success")

})


router.delete('/:id', [auth,admin], async (req, res) => {
    const genre = await Genre.findByIdAndDelete(req.params.id)
    if (!genre) return res.status(404).send("Genre with given id not found")
    res.send(genre)
})

router.get('/:id', validateObjectId ,async (req, res) => {
    const genre = await Genre.findById(req.params.id)
    if (!genre) return res.status(404).send("Genre with given id not found")
    res.send(genre)
})


module.exports = router