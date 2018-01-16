const fxy = require('fxy')
const details = require('./details')
const template = require('./template.js')

//exports
module.exports = get_content
module.exports.details = details
module.exports.template = template

//shared actions
function get_content(project,inputs){
	let detail_inputs = [inputs.file]
	let content = null
	if('type' in inputs) detail_inputs.push(inputs.type)
	if(fxy.is.nothing(inputs.content)) content = template(inputs.file)
	else if(inputs.content !== false) content = inputs.content
	return [
		details(project,...detail_inputs),
		content
	].join('')
}