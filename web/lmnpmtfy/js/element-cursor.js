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
