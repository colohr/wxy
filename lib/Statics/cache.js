const fxy = require('fxy')
const ms = require('ms')

class Cache{
	constructor(options){
		this.options = options
	}
	get value(){ return get_cache_value(this.options) }
	join(value){ return join_cache_value(this,value) }
	
}

//exports
module.exports = get_cache

//shared actions
function get_age_value(value){
	if(fxy.is.text(value)) return ms(value)
	else if(fxy.is.number(value)) return ms(`${value}d`)
	return null
}

function get_cache(data){
	let options = null
	if(fxy.is.data(data)) options = data
	else if(fxy.is.text(data) || fxy.is.number(data)) options = {age:data}
	else if(fxy.is.bool(data) && data === true) options = {age:1}
	else options = {}
	return new Cache(options)
}


function get_cache_value(options){
	let value = {}
	if(fxy.is.data(options)){
		for(let name in options){
			switch(name){
				case 'age':
					let age = get_age_value(options.age)
					if(age !== null) value.maxage = age
					break
				default:
					value[name] = options[name]
					break
			}
		}
	}
	return value
}

function join_cache_value(cache,value){
	return fxy.as
	          .one({},cache.value,get_cache_value(value))
}


/*
const max_age = {
	ms('2 days')  // 172800000
ms('1d')      // 86400000
ms('10h')     // 36000000
ms('2.5 hrs') // 9000000
ms('2h')      // 7200000
ms('1m')      // 60000
ms('5s')      // 5000
ms('1y')      // 31557600000
ms('100')     // 100
}
*/


