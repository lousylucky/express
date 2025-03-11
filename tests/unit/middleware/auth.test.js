const { User } = require('../../../models/user')
const auth = require('../../../middleware/auth')
const mongoose = require('mongoose')

describe('middleware', () => {
    it('should populare req.user with the payload of a valid JWT', () => {
        const user = {
             _id: new mongoose.Types.ObjectId().toHexString(), 
            isAdmin: true
        }
        token = new User(user).generateAuthToken()

        const req = {
            header: jest.fn().mockReturnValue(token)
        }

        const res = {}
        const next = jest.fn()

        auth(req, res, next)
        expect(req.user).toMatchObject(user)
    })
})