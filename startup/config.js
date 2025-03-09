const config = require('config')

module.exports = function readConfig(){
    if(!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR: jwtPrivateKey is not defined')
    }
}