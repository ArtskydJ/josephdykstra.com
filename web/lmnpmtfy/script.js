var hash = window.location.hash
var path = window.location.origin + window.location.pathname

document.getElementById('site-search-text').value = ''

if (hash) {
	console.log('moves the cursor, types, and clicks search')

	moveCursor(function () {
		var text = hash.slice(1)
		clickInput()
		typeInput(text, function () {
			moveCursor2(function () {
				setTimeout(clickSearch, 100, text)
			})
		})
	})

	function moveCursor(cb) {
		var TOP = [0, 190]
		var LEFT = [0, -190]
		var VW = [0, 50]

		var el = cursorElement()
		var fraction = 0
		stepCursor()
		var interval = setInterval(stepCursor, 10)
		function stepCursor() {
			var calc = calculate.bind(null, fraction)
			el.style.top = calc(TOP) + 'px'
			el.style.left = ['calc(', calc(LEFT), 'px + ', calc(VW), 'vw)'].join('')

			if (fraction < 1) {
				fraction += 0.01
			} else {
				clearInterval(interval)
				cb()
			}
		}
	}

	function clickInput() {
		var input = document.getElementById('site-search-text')
		input.focus()
		input.className = 'hover'
		console.log('clicked')
	}

	function typeInput(text, cb) {
		var el = document.getElementById('site-search-text')
		var letter = 0
		var interval = setInterval(stepInput, 200)
		function stepInput() {
			el.value = text.slice(0, letter)

			if (letter < text.length) {
				letter++
			} else {
				clearInterval(interval)
				cb()
			}
		}
	}

	function moveCursor2(cb) {
		var LEFT = [-190, 180]

		var el = cursorElement()
		var fraction = 0
		stepCursor()
		var interval = setInterval(stepCursor, 10)
		function stepCursor() {
			el.style.left = ['calc(50vw + ', calculate(fraction, LEFT), 'px)'].join('')

			if (fraction > 0.85) {
				var el2 = document.getElementById('site-search-submit')
				el2.className = 'hover'
			}

			if (fraction < 1) {
				fraction += 0.01
			} else {
				clearInterval(interval)
				cb()
			}
		}
	}

	function clickSearch(text) {
		window.location.assign('https://npmjs.com/search?q=' + text)
	}

	function cursorElement() {
		var el = document.getElementById('cursor')
		if (!el) {
			var div = document.createElement('div')
			div.innerHTML = '<img id="cursor" src="cursor.png"></img>'
			document.body.appendChild(div)
		}
		el = document.getElementById('cursor')
		return el
	}

	function calculate(fraction, range) {
		var diff = range[1] - range[0]
		var part = diff * fraction
		return String(Math.round(range[0] + part))
	}

} else {
	console.log('allowing user to type and submit')
	document.getElementById('site-search').onsubmit = onsubmit

	function onsubmit(ev) {
		killEvent(ev)
		var text = document.getElementById('site-search-text').value
		var el = copyableElement()
		el.value = path + '#' + text
		el.selectionStart = 0
		el.selectionEnd = el.value.length
	}

	function killEvent(ev) {
		ev.stopPropagation()
		ev.preventDefault()
	}

	function copyableElement() {
		var el = document.getElementById('copyable')
		if (!el) {
			var div = document.createElement('div')
			div.innerHTML = '<br><br>Press Ctrl + C to copy: '

			el = document.createElement('input')
			el.id = 'copyable'

			document.body.appendChild(div)
			div.appendChild(el)
		}
		return el
	}
}
