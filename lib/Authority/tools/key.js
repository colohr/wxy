const uuid = require('node-uuid')
const fxy = require('fxy')

const key = {
	base:get_base,
	data:get_data,
	pair:get_pair,
	uid:get_uid,
	uuid:uuid
}

//exports
module.exports = key

//shared actions
function get_base(pair){
	if(fxy.is.nothing(pair)) pair = get_pair()
	else if(fxy.is.text(pair)) pair = get_data(pair)
	if(!fxy.is.data(pair)) return null
	return new Buffer(`${pair.user}:${pair.password}`).toString('base64')
}

function get_data(base){
	const decoded = base.includes(':') ? base:new Buffer(base, 'base64').toString('utf8')
	return {
		user: decoded.split(':')[0],
		password: decoded.split(':')[1]
	}
}

function get_pair(){
	return {
		user:uuid.v4(),
		password:uuid.v4()
	}
}

function get_uid(type){ return uuid[type || 'v4']() }