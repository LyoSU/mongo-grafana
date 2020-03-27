const logger = require('koa-logger')
const responseTime = require('koa-response-time')
const bodyParser = require('koa-bodyparser')
const Router = require('koa-router')
const Koa = require('koa')

const app = new Koa()

app.use(logger())
app.use(responseTime())
app.use(bodyParser())

const {
  db
} = require('./database')

app.use(async (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*");
  ctx.set("Access-Control-Allow-Methods", "POST");
  ctx.set("Access-Control-Allow-Headers", "accept, content-type");

  ctx.props = Object.assign(ctx.query || {}, ctx.request.body || {})

  try {
    ctx.state.db = db

    await next()

    ctx.assert(ctx.result, 404, 'Not Found')

    ctx.body = ctx.result
  } catch (err) {
    ctx.status = err.statusCode || err.status || 500
    ctx.body = {
      ok: false,
      error_code: ctx.status,
      description: err.message
    }
  }
})

const route = new Router()

route.use('*', require('./api').routes())

app.use(route.routes())

app.on('error', err => {
  if (process.env.NODE_ENV !== 'test') {
    console.log('sent error %s to the cloud', err.message)
    console.log(err)
  }
})

db.connection.once('open', () => {
  console.log('Connected to MongoDB')

  const port = process.env.PORT || 3000

  app.listen(port, '0.0.0.0', () => {
    console.log('Listening port', port)
  })
})
