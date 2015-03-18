module.exports = function killEvent(ev) {
	ev.stopPropagation()
	ev.preventDefault()
}
