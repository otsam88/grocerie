// Dependencies
// ============
var express = require('express')
var mongoose = require('mongoose')
var parser = require('body-parser')

// Fire up database.
// =================
mongoose.connect('mongodb://localhost/groceriedb')
var db = mongoose.connection
db.on('error', console.error.bind(console, 'Error connecting to database'))
db.once('open', () => {
  console.log('Connected to database.')
})

// Define db model.
// ================
var itemSchema = mongoose.Schema({
  name: String,
  status: Boolean,
  listName: String
})

var Item = mongoose.model('Item', itemSchema)


// Server stuff.
// =============
var port = 3000
var host = '127.0.0.1'

// Helper functions.
// =================
var logRequest = (request, response, next) => {
  /* Middleware that logs what type of request came in.
  */
  console.log(`Serving ${request.method} request...`)
  next()
}

var saveItems = (items, recordId, next) => {
  /* Write items array to db.
     Tag all items in this run with recordId.
     Takes next callback for async chains.
     Will break if client-side storage is changed from [] to {}.
  */
  for (var item of items) {
    var newItem = new Item({
      name: item.name,
      status: item.status,
      listName: recordId
    })

    newItem.save((error, newItem) => {
      if (error) {
        console.log(error)
        console.log('Error saving to database. Item:', newItem)
        next(error)
      }
    })
  }

  next()
}

// Server config.
// ==============
var app = express()

app.set('views', __dirname)
app.set('view engine', 'ejs')

app.use(logRequest)
app.use(parser.json({strict: false}))

app.listen(port, host, (request, response) => {
  console.log(`Listening on ${host}:${port}...`)
})

// Routing and handling.
// =====================
app.get('/', (request, response) => {
  response.render('index')
})

app.get('/query', (request, response) => {
  Item.find(request.query)
    .select({name: 1, status: 1, _id: 0})
    .exec((error, result) => {
      if (error) {
        response.sendStatus(500)
        console.log(error)
        console.log('Error querying database. Query:', request.query)
      } else {
        response.send(result)
      }
    })
})

app.post('/', (request, response) => {
  saveItems(request.body.items, request.body.listId, (error) => {
    if (error) {
      response.sendStatus(500)
    } else {
      response.send(request.body.listId)
    }
  })
})


