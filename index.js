var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var request = require('request')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('hello Word')
})

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === 'ping') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i]
    sender = event.sender.id
    if (event.message && event.message.text) {
      text = event.message.text
      // Handle a text message from this sender
     console.log(text)
      // เพิ่มเงือนไข

      sendTextMessage(sender, text)
    }
  }
  res.sendStatus(200)
})

var token = 'EAALZAkeZC9FZBcBADTZCtZAmP9AClYqlh5e1mZB0vPcqPVz847IFuhfBZCkm7byTB9ZByl2iuoxwNOe1I2mEAXFZAyZBipD1MQd8ODOmIgX2j2vtM2gymmZBtnXUvZCCHy8BtrWXMNrhHoAn6yyt80mG0ZClCOYorDiRGPOX6MjesUW31ngZDZD'
function sendTextMessage (sender, text) {
  messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData,
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}

app.set('port', (process.env.PORT || 3000))

app.listen(app.get('port'), function () {
  console.log('server Start at port', app.get('port'))
})
