const request = require('supertest')
const {Genre} = require('../../models/genre')
const {User} = require('../../models/user')
let server 

describe('/api/genres', () => {
    let token

    beforeEach(()=> { 
        server = require('../../index')
        token = new User().generateAuthToken()

    })
    afterEach( async ()  => { 
        await server.close()
        await Genre.deleteMany({})
    })

    const exec = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({name: 'SF'})
    }

    it('should return 401 if no token is provided', async () => {
        token = ''
        const res = await exec()
        expect(res.status).toBe(401)
    }),
    it('should return 400 if no token is provided', async () => {
        token = null
        const res = await exec()
        expect(res.status).toBe(400)
    }),
    it('should return 200 if no token is valid', async () => {
        const res = await exec()
        expect(res.status).toBe(200)
    })
})