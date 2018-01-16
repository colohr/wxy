const fxy = require('fxy')
class Cache{
	constructor(options){
		if(!fxy.is.data(options)) options = {}
		this.options = options
	}
	get control(){ return get_cache_control(this.headers.maxage) }
	get headers(){ return this.value }
	get value(){ return get_cache_value(this.options) }
	
}

//exports
module.exports = get_cache

//shared actions
function get_cache(data){
	return new Cache(data)
}

function get_cache_control(value){
	let seconds = require('ms')(value) / 1000
	return `max-age=${seconds}`
}

function get_cache_value(options){
	let value = {}
	if('age' in options){
		value.maxage = `${options.age}d`
		value.maxAge = `${options.age}d`
	}
	if('maxage' in options) {
		value.maxage = options.maxage
		value.maxAge = options.maxage
	}
	return value
}



