const ES = require('uglify-es')
const fxy = require('fxy')

//exports
module.exports = convert_file
module.exports.code = convert_code
module.exports.script = convert_script


//shared actions
function convert_code(...x){ return ES.minify(...x).code }

function convert_file(target,options){
	let item = null
	if(fxy.is.text(target)) item = mini_item(target,options)
	else if(target instanceof fxy.Item) item = mini_script(target,options)
	return item
}

function convert_script(...x){ return ES.minify(...x) }

function mini_item(file,options){
	if(fxy.exists(file)){
		let item = fxy.read_item(file)
		return mini_script(item,options)
	}
	return null
}

function mini_script(item,options){
	item.mini = ES.minify(item.content,options).code
	return item
}