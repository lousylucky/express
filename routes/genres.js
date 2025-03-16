const express = require('express')
const router = express()
const {Genre, validate} = require('../models/genre')
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const validateObjectId = require('../middleware/validateObjectId')
const validator = require('../middleware/validator')
const logger = require('../startup/logger')

router.get('/', async (req, res) => {
    logger.log('info', `Getting all genres - User: ${req.user ? req.user._id : 'Anonymous'}, URL: ${req.originalUrl}, IP: ${req.ip}`)
    return res.send(await Genre.find().sort('name'))
})

router.post('/', [auth, validator(validate)], async (req, res) => {     

    const genre = new Genre({ name: req.body.name })

    try {
        const result = await genre.save()
        res.send(result)
    } catch (error) {
        res.status(404).send('Could not save in the database')
    }

})

router.put('/:id', [auth, validator(validate)], async (req, res) => {

    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name })
    if (!genre) return res.status(404).send("Genre with given id not found")
    res.send("Success")
})


router.delete('/:id', [auth,admin, validateObjectId], async (req, res) => {
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