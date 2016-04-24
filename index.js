var express = require('express')

var app = express()

app.get('/', function (req, res) {
  res.send('hello Word')
})

app.set('port', (process.env.port || 3000))

app.listen(app.get('port'), function () {
  console.log('server Start at port', app.get('port'))
})
