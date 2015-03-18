var rangeInterval = require('range-interval')
var cursorElement = require('./element-cursor.js')
var calculate = require('./calculate.js')

var cursorRepeatOpts = {
	start: 0,
	end: 1,
	step: 0.01,
	interval: 10
}

module.exports = function troll(text) {
	moveCursorToInput(function () {
		clickInput()
		typeInput(text, function () {
			moveCursorToSearchButton(function () {
				setTimeout(clickSearchButton, 100, text)
			})
		})
	})
}

function moveCursorToInput(cb) {
	var TOP = [0, 190]
	var LEFT = [0, -190]
	var VW = [0, 50]

	var cursor = cursorElement()

	rangeInterval(cursorRepeatOpts, function stepCursor(fraction) {
		var calc = calculate.bind(null, fraction)
		cursor.style.top = calc(TOP) + 'px'
		cursor.style.left = ['calc(', calc(LEFT), 'px + ', calc(VW), 'vw)'].join('')
	}, cb)
}

function clickInput() {
	var input = document.getElementById('site-search-text')
	input.focus()
	input.className = 'hover' // This doesn't really show up...
}

function typeInput(text, cb) {
	var input = document.getElementById('site-search-text')
	rangeInterval({
		start: 0,
		end: text.length,
		step: 1,
		interval: 200
	}, function stepInput(index) {
		input.value = text.slice(0, index)
	}, cb)
}

function moveCursorToSearchButton(cb) {
	var LEFT = [-190, 180]

	var cursor = cursorElement()

	rangeInterval(cursorRepeatOpts, stepCursor, cb)

	function stepCursor(fraction) {
		cursor.style.left = ['calc(50vw + ', calculate(fraction, LEFT), 'px)'].join('')

		if (fraction > 0.83) {
			var button = document.getElementById('site-search-submit')
			button.className = 'hover'
		}
	}
}

function clickSearchButton(text) {
	window.location.replace(window.location.href + '#') // If you go 'back' to this page, it won't troll you again.
	window.location.assign('https://npmjs.com/search?q=' + text)
}
