const { Rent } = require('../../models/rent')
const { User } = require('../../models/user')
const { Movie } = require('../../models/movie')
const mongoose = require('mongoose')
const request = require('supertest')
const moment = require('moment')

describe('/api/returns', () => {
    let server
    let customerId
    let movieId
    let rent
    let token
    let movie 
    

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

        movieContent = {
            _id: movieId,
            title: '12345',
            dailyRentalRate: 2,
            genre: { name: 'SF' },
            numberInStock: 10
        }
        
        movie = new Movie(movieContent)

        rent = new Rent({
            customer: {
                _id: customerId,
                name: '12345',
                phone: '12345'
            },
            movie: movieContent
        })
        await rent.save()
        await movie.save()
    })


    afterEach(async () => {
        await server.close()
        await Rent.deleteMany({})
        await Movie.deleteMany({})
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
        }),
        it('should increase the stock if valid input ', async () => {
            await exec()
            const movieInDb = await Movie.findById(movieId)
            expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1)

        }),
        it('should return the rent in the body ', async () => {
            const res = await exec()
            expect(Object.keys(res.body)).toEqual(
                expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee', 'customer', 'movie'])
            )
        })
})