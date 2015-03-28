(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],2:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],3:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":1,"./encode":2}],4:[function(require,module,exports){
module.exports = function calculate(fraction, range) {
	var diff = range[1] - range[0]
	var part = diff * fraction
	return String(Math.round(range[0] + part))
}

},{}],5:[function(require,module,exports){
module.exports = function copyableElement() {
	var copyable = document.getElementById('copyable')
	if (!copyable) {
		var div = document.createElement('div')
		div.innerHTML = '<br><br>Press Ctrl + C to copy: '

		copyable = document.createElement('input')
		copyable.id = 'copyable'

		document.body.appendChild(div)
		div.appendChild(copyable)
	}
	return copyable
}

},{}],6:[function(require,module,exports){
module.exports = function cursorElement() {
	var cursor = document.getElementById('cursor')
	if (!cursor) {
		var div = document.createElement('div')
		div.innerHTML = '<img id="cursor" src="cursor.png"></img>'
		document.body.appendChild(div)
		cursor = document.getElementById('cursor')
	}
	return cursor
}

},{}],7:[function(require,module,exports){
var qs = require('querystring')

function setup() {
	document.getElementById('site-search-text').value = ''
	var hashExists = /#/.test(window.location.href)
	var query = window.location.search.slice(1)
	return hashExists ? null : qs.parse(query).q
}

module.exports = setup

},{"querystring":3}],8:[function(require,module,exports){
module.exports = function killEvent(ev) {
	ev.stopPropagation()
	ev.preventDefault()
}

},{}],9:[function(require,module,exports){
module.exports = function selectAll(element) {
	element.selectionStart = 0
	element.selectionEnd = element.value.length
}

},{}],10:[function(require,module,exports){
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

},{"./calculate.js":4,"./element-cursor.js":6,"range-interval":12}],11:[function(require,module,exports){
var qs = require('querystring')
var copyableElement = require('./element-copyable.js')
var killEvent = require('./kill-event.js')
var selectAll = require('./select-all.js')

function userInput() {
	var siteSearch = document.getElementById('site-search')

	siteSearch.onsubmit = function onsubmit(ev) {
		killEvent(ev)

		var path = window.location.origin + window.location.pathname
		var siteSearchText = document.getElementById('site-search-text')
		var text = siteSearchText.value
		var copyable = copyableElement()

		copyable.value = path.replace(/\/$/, '') + '/?' + qs.stringify({ q: text })
		selectAll(copyable)
	}
}

module.exports = userInput

},{"./element-copyable.js":5,"./kill-event.js":8,"./select-all.js":9,"querystring":3}],12:[function(require,module,exports){
var xtend = require('xtend')
var defaultOpts = {
	start: 0,
	end: 100,
	step: 1,
	interval: 10
}

// Consider publishing this on npm
module.exports = function repeatDelay(options, each, cb) {
	if (typeof options === 'function') {
		cb = each
		each = options
		options = {}
	}
	var opts = xtend(defaultOpts, options)

	var n = opts.start
	var iv = setInterval(iterate, opts.interval)
	function iterate() {
		each(n)
		n += opts.step
		if (n > opts.end) {
			clearInterval(iv)
			cb && cb()
		}
	}
}

},{"xtend":13}],13:[function(require,module,exports){
module.exports = extend

function extend() {
    var target = {}

    for (var i = 0; i < arguments.length; i++) {
        var source = arguments[i]

        for (var key in source) {
            if (source.hasOwnProperty(key)) {
                target[key] = source[key]
            }
        }
    }

    return target
}

},{}],14:[function(require,module,exports){
var init = require('./init.js')
var userInput = require('./user-input.js')
var troll = require('./troll.js')

var text = init()
if (text) troll(text)
else userInput()

},{"./init.js":7,"./troll.js":10,"./user-input.js":11}]},{},[14]);
