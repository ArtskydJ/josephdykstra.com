var init = require('./init.js')
var userInput = require('./user-input.js')
var troll = require('./troll.js')

var text = init()
if (text) troll(text)
else userInput()
