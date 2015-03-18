module.exports = function calculate(fraction, range) {
	var diff = range[1] - range[0]
	var part = diff * fraction
	return String(Math.round(range[0] + part))
}
