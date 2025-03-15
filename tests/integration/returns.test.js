const { Rent } = require('../../models/rent')
const { User } = require('../../models/user')
const mongoose = require('mongoose')
const request = require('supertest')
const moment = require('moment')

describe('/api/returns', () => {
    let server
    let customerId
    let movieId
    let rent
    let token

    const exec = async () => {
        return await request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId })
    }

    beforeEach(async () => {
        server = require('../../index')
        customerId = new mongoose.Types.ObjectId()
        movieId = new mongoose.Types.ObjectId()
        token = new User().generateAuthToken()

        rent = new Rent({

            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 2
            }
        })
        await rent.save()
    })


    afterEach(async () => {
        await server.close()
        await Rent.deleteMany({})
    })

    it('should return 401 if clinet is not log in', async () => {
        token = ''
        const res = await exec()
        expect(res.status).toBe(401)
    }),
        it('should return 400 if customerId is not provided', async () => {
            customerId = ''
            const res = await exec()
            expect(res.status).toBe(400)
        }),
        it('should return 400 if movieId is not provided', async () => {
            movieId = ''
            const res = await exec()
            expect(res.status).toBe(400)
        }),
        it('should return 404 if no rental found is not provided', async () => {
            customerId = new mongoose.Types.ObjectId()
            const res = await exec()
            expect(res.status).toBe(404)
        }),
        it('should return 400 if rental already processed', async () => {
            rent.dateReturned = new Date()
            await rent.save()
            const res = await exec()
            expect(res.status).toBe(400)
        }),
        it('should return 200 if everything ok ', async () => {
            const res = await exec()
            expect(res.status).toBe(200)
        })
        it('should set returnDate if everything ok ', async () => {
            await exec()
            const rentInDb = await Rent.findById(rent._id)
            const diff = new Date() - rentInDb.dateReturned
            expect(diff).toBeLessThan(10 * 1000)
        })
        it('should set rentalFee if input is valid ok ', async () => {
            rent.dateOut = moment().add(-7, 'days').toDate()
            await rent.save()
            await exec()
            const rentInDb = await Rent.findById(rent._id)
            expect(rentInDb.rentalFee).toBe(14)
        })
})