// Dependencies
// ============
var ejs = require('ejs')
var express = require('express')

var port = 3000
var host = '127.0.0.1'

var logRequest = (request, response, next) => {
  /* Middleware that logs what type of request came in.
  */
  console.log(`Serving ${request.method} request...`)
  next()
}

var app = express()

app.set('views', __dirname)
// app.engine('html', ejs.renderFile)
app.set('view engine', 'ejs')

app.use(logRequest)

app.listen(port, host, (request, response) => {
  console.log(`Listening on ${host}:${port}...`)
})

app.get('/', (request, response) => {
  response.render('index')
})

app.post('/', (request, response) => {
  // @todo: Send proper response.
})
