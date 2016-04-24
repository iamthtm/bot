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
      // console.log(text)
      // เพิ่มเงือนไข

      sendTextMessage(sender, text)
    }
  }
  res.sendStatus(200)
})

var token = 'CAALZAkeZC9FZBcBABAxStRty7j972oVbcPmT5kmRuS4eulcpNRfW5NjbyHdlPlEL8t46UZANsqDCJZC9eg2xZACLRIL82fHHc8W5P2BYmSqKSooN0UBVlZAnzBRicDySr9C6ZBcvPyvCC5pWB5bcjpnnSvKFtvCDXMn1JdyycBJRpDT6GLCY6czZAfIkG3dFwx8gU5PDDvhXwDgZDZD'

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
