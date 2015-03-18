module.exports = function selectAll(element) {
	element.selectionStart = 0
	element.selectionEnd = element.value.length
}
