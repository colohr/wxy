const fxy = require('fxy')

const Environment = ({env})=>({
	directory:env.PWD,
	info(){ return get_info(env) },
	port:env.PORT,
	npm(){ return get_npm(env) }
})

//exports
module.exports = Environment

//shared actions
function get_data(env){
	const data = {}
	for(let name in env){
		let field = fxy.id._(name)
		data[field] = env[name]
	}
	return data
}
function get_info(env){
	const data = get_data(env)
	const info = {}
	for(let name in data){
		if(name.length && !name.includes('npm')){
		    info[name] = data[name]
		}
	}
	return info
}

function get_npm(env){
	const data = get_data(env)
	const info = {}
	for(let name in data){
		if(name.includes('npm')) {
			let field = name.replace('npm_','')
			info[field] = data[name]
		}
	}
	return info
}