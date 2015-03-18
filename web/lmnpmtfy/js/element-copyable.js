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
