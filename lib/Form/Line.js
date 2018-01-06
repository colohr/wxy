const fxy = require('fxy')

class Line{ constructor(input){ Object.assign(this,get_line(input)) } }

//exports
module.exports = input=>new Line(input)
module.exports.is_item = is_item

//shared actions
function get_data(item){
	let parts = item.split('=')
	let name = fxy.id._(parts[0])
	if(!name.length) return null
	let value = get_value(parts[1])
	return {[name]:value}
}

function get_item(item){
	item = item.replace('--','').replace('-','')
	if(item.includes('=')) return get_data(item)
	return {[item]:true}
}

function get_line({argv}){
	const items = argv.filter(is_item).map(get_item).filter(is_value)
	return fxy.as.one(...items)
}

function get_value(text){
	let value = null
	switch(text){
		case 'false':
		case 'true':
			value = text === 'true'
			break
		case 'null':
		case 'undefined':
			value = null
			break
		default:
			if(fxy.is.json(text)){
				try{ value = JSON.parse(text) }
				catch(e){ }
			}
			if(fxy.is.nothing(value)){
				if(text.includes(',')) value = text.split(',').map(x=>x.trim()).filter(x=>x.length).map(get_value).filter(is_value)
				else if(fxy.is.numeric(text)) value = fxy.as.number(text)
				else value = text
			}
			
	}
	return value
}

function is_item(value){ return fxy.is.text(value) && value.charAt(0) === '-' }

function is_value(value){ return value !== null }

