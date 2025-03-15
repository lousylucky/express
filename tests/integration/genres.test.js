const request = require('supertest')
const {Genre} = require('../../models/genre')
const {User} = require('../../models/user')
const { default: mongoose } = require('mongoose')
let server 

describe('/api/genres', () => {
    beforeEach(()=> { server = require('../../index')})
    afterEach( async ()  => { 
        await server.close()
        await Genre.deleteMany({})
    })
    describe('GET', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {name:'genre 1'},
                {name:'genre 2'},
            ])
            const res = await request(server).get('/api/genres')
            expect(res.status).toBe(200)
            expect(res.body.length).toBe(2)
            expect(res.body.some(g => g.name === 'genre 1')).toBeTruthy()
            expect(res.body.some(g => g.name === 'genre 2')).toBeTruthy()
        })
    })
    describe('GET /:id', () => {
        it('should get genre if valid id is passed', async () => {
            const genre = await new Genre(
                {name:'SF'},
            )
            await genre.save()
            const res = await request(server).get('/api/genres/' + genre._id)
            expect(res.status).toBe(200)
            expect(res.body).toHaveProperty('name', genre.name)
        }),
        it('should return 404 if invalid id is passed', async () => {
            const res = await request(server).get('/api/genres/' + '10')
            expect(res.status).toBe(404)
        }),
        it('should return 404 if valid id passed but no genre found', async () => {
            const id = new mongoose.Types.ObjectId()
            const res = await request(server).get('/api/genres/' + id)
            expect(res.status).toBe(404)
        })
    })

    describe('POST /', () => {

        // define the happy path
        let token
        let name
        const exec = async () => {
            return await request(server)
                .post('/api/genres')
                .set('x-auth-token', token)
                .send({name: name})
        }
        beforeEach(()=> {
            token = new User().generateAuthToken()
            name = 'SF'
        })

        it('should return 401 if client is not log-in', async () => {
            token = ''

            const res = await exec()

            expect(res.status).toBe(401)
        }),
        it('should return 400 if genre if unknow enum', async () => {
            name = 'ABC'

            const res = await exec()

            expect(res.status).toBe(400)
        }),
        it('should save the genre if is valid', async () => {
            await exec()

            const genre = Genre.find({name: 'SF'})
            expect(genre).not.toBeNull()
        }),
        it('should return the genre if is valid', async () => {
            const res = await exec()

            expect(res.body).toHaveProperty('_id')
            expect(res.body).toHaveProperty('name','SF')
        })
    })

    describe('PUT /:id', () => {

        // define the happy path
        let token
        let name
        const exec = async () => {
            return await request(server)
                .put('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({name: name})
        }
        beforeEach(()=> {
            token = new User().generateAuthToken()
            name = 'SF'
            id = new mongoose.Types.ObjectId()
        })
        afterEach( async ()  => { 
            await server.close()
            await Genre.deleteMany({})
        })

        it('should return 401 if client is not log-in', async () => {
            token = ''
            const res = await exec()
            expect(res.status).toBe(401)
        }),        
        it('should return 400 if genre if unknow enum', async () => {
            name = 'ABC'

            const res = await exec()

            expect(res.status).toBe(400)
        }),
        it('should genre when valid Id given', async () => { 
            const genre = await new Genre(
                {name:'SF'},
            )
            id = genre._id
            await genre.save()

            const res = await exec()

            expect(res.status).toBe(200)
        })
        it('should return 404 when genre not found', async () => { 
            
            const res = await exec()
            expect(res.status).toBe(404)
        })
    })

    describe('DELETE /:id', () => {

        // define the happy path
        let token
        let name
        const exec = async () => {
            return await request(server)
                .delete('/api/genres/' + id)
                .set('x-auth-token', token)
                .send({name: name})
        }
        beforeEach(()=> {
            token = new User({isAdmin: true}).generateAuthToken()
            name = 'SF'
            id = new mongoose.Types.ObjectId()
        })
        afterEach( async ()  => { 
            await server.close()
            await Genre.deleteMany({})
        })

        it('should return 404 when no genre found', async () => {
            const res = await exec()
            expect(res.status).toBe(404)
        }),   
        it('should return 403 when user has no admin rights', async () => {
            token = new User().generateAuthToken()

            const res = await exec()
            expect(res.status).toBe(403)
        }),  
        it('should return 401 if client is not log-in', async () => {
            token = ''
            const res = await exec()
            expect(res.status).toBe(401)
        }),        
        it('should return 200 if genre deleted', async () => {
            const genre = await new Genre(
                {name:'SF'},
            )
            id = genre._id
            await genre.save()

            const res = await exec()

            expect(res.status).toBe(200)
        })
    })

})