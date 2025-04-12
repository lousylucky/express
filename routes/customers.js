const express = require('express')
const router = express()
const { Customer, validate } = require('../models/customer')
const auth = require('../middleware/auth')


router.get('/', auth, async (req, res) => {
    return res.send(await Customer.find().sort('name'))
})

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body)
    if (error) return res.status(400).send(error.message)

    const customer = new Customer({
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })

    try {
        const result = await customer.save()
        res.send(result)
    } catch (error) {
        res.status(404).send('Could not save in the database')
    }

})

router.put('/:id', auth, async (req, res) => {

    const { error } = validate(req.body)
    if (error) return res.status(400).send(error)

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold
    })
    if (!customer) return res.status(404).send("customer with given id not found")
    res.send("Success")

})


router.delete('/:id', auth, async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id)
    if (!customer) return res.status(404).send("customer with given id not found")
    res.send(customer)
})

router.get('/:id', auth, async (req, res) => {
    const customer = await Customer.findById(req.params.id)
    if (!customer) return res.status(404).send("customer with given id not found")
    res.send(customer)
})


module.exports = router