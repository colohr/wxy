const fxy = require('fxy')
const fxy_url = require('./fxy.url')
const url_value = Symbol('Url value')
const url_symbol = Symbol('CloudUrl')


class CloudUrl{
	static get symbol(){ return url_symbol }
	constructor(value){
		this[url_value] = get_url(value)
	}
	print(){ return get_print_value(this) }
	get value(){ return this[url_value] }
	
	//prototype
	toString(){ return get_text_value(this) }
}

//exports
module.exports = value => new CloudUrl(value)
module.exports.Url = CloudUrl
module.exports.symbol = url_symbol

//shared actions
function get_print_value(url){ return `url:\n${url}` }

function get_text_value(url){ return fxy_url.format(url.value) }

function get_url(value){
	if(fxy.is.data(value)) {
		if(value instanceof Map) value = get_url_data_from_cloud(value)
		return get_url_from_data(value)
	}
	if(fxy.is.text(value)) return get_url_from_text(value)
	return get_url_from_text('http://localhost')
}

function get_url_from_data(url_data){
	let options = fxy_url.options(url_data)
	let text_url = fxy_url.format(options)
	return fxy_url.create(text_url)
}

function get_url_from_text(text_url){ return fxy_url.create(text_url) }

function get_url_data_from_cloud(cloud){
	let data = {}
	data.hostname = cloud.domain
	data.pathname = cloud.get('path')
	data.port = cloud.port
	data.protocol = cloud.get('protocol')
	return data
}
