var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var text
var token = 'EAALZAkeZC9FZBcBAPYysDEBXBEnIAHCrf3QbBBucIZCwAnPObm4bOSvL17HNVWVZCgwHFJb9paKZABZAtZCpl5UMJzVXrMAquTQa5I7Ao16smch1V2uO6Y98i5hLzoTM5dN1S2vMQ0vRkgsihsjJmXtw684I9riXrNZCjtFZC5FSrAaAZDZD'
app.use(express.static('public'))
app.use(bodyParser.json())

app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === '1234') {
    res.send(req.query['hub.challenge'])
  }
  res.send('Error, wrong validation token')
})

app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging
  for (var i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i]
    var sender = event.sender.id
    if (event.message && event.message.text) {
      text = event.message.text

      console.log(text)
      // sendTextMessage(sender, text)
      var sln = text.length
      // console.log('length : ' + sln)
      var getFunc = text.substring(0, 3)
      console.log('func : ' + getFunc)

      if (getFunc === 'sum') {
        var gettext = text.substring(4, text.length)
        console.log('number : ' + gettext)
        var space = gettext.search(' ')
        var number1 = parseFloat(gettext.substring(0, space))
        var number2 = parseFloat(gettext.substring(space, gettext.length))
        console.log('number1 : ' + num1 + ' number2 : ' + num2)
        var sum = number1+number2
        console.log('Total : ' + sum)
        sendTextMessage(sender, 'Total : ' + sum)
      }

      if (getFunc === 'max') {
        var gettext = text.substring(4, text.length)
        console.log('number : ' + gettext)
        var space = gettext.search(' ')
        var number1 = parseFloat(gettext.substring(0, space))
        var number2 = parseFloat(gettext.substring(space, gettext.length))
        console.log('number1 : ' + number1 + ' number2 : ' + number2)
        if (number1 > number2) {
          sendTextMessage(sender, 'max : ' + number1)
        }
        if (number2 > number1) {
          sendTextMessage(sender, 'max : ' + number2)
        }
      }

      if (getFunc === 'min') {
        var gettext = text.substring(4, text.length)
        console.log('number : ' + gettext)
        var space = gettext.search(' ')
        var num1 = parseFloat(gettext.substring(0, space))
        var num2 = parseFloat(gettext.substring(space, gettext.length))
        console.log('number1 : ' + num1 + ' number2 : ' + num2)
        if (num1 < num2) {
          sendTextMessage(sender, 'min : ' + num1)
        }
        if (num2 < num1) {
          sendTextMessage(sender, 'min : ' + num2)
        }
      }

      if (getFunc === 'avg') {
        var num = []
        var sum = 0
        var gettext = text.substring(4, text.length)
        console.log('text : ' + gettext)
        num = gettext.split(' ')
        console.log('split : ' + num + ' len = ' + num.length)
        for (var i = 0;i < num.length;i++) {
          sum += parseFloat(num[i])
        }
        console.log('sum : ' + sum + 'avg : ' + sum/num.length)
        sendTextMessage(sender, 'avg : ' + sum/num.length)
      }
    }
  }
  res.sendStatus(200)
})

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function () {
  console.log('Example app listening on port ' + app.get('port') + '!')
})

function sendTextMessage (sender, text) {
  var messageData = {
    text: text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: token},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: messageData
    }
  }, function (error, response, body) {
    if (error) {
      console.log('Error sending message: ', error)
    } else if (response.body.error) {
      console.log('Error: ', response.body.error)
    }
  })
}
