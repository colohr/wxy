const uuid = require('node-uuid')

class Key extends Map{
	static get uid(){ return uuid }
	static get data(){ return get_data }
	constructor(){
		super([
			['user',uuid.v4()],
			['password',uuid.v4()]
		])
	}
	get base(){ return get_base(this) }
	sign(secret){ return get_signed(this,secret) }
	toString(){ return this.base }
}

//exports
module.exports = Key

//shared actions
function get_base(key){
	return new Buffer(`${key.get('user')}:${key.get('password')}`).toString('base64')
}

function get_data(base){
	const decoded = new Buffer(base, 'base64').toString('utf8')
	return {
		user: decoded.split(':')[0],
		password: decoded.split(':')[1]
	}
}

function get_signed(key,secret){
	return require('./token').create({
		user:key.get('user'),
		password:key.get('password')
	},secret)
}