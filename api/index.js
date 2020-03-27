const Router = require('koa-router')
const api = new Router()

api.all('/query', require('./query'))
api.all('/search', require('./search'))
api.all('/', require('./main'))

module.exports = api
