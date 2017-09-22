const Key = require('./Key')
const authorization_request = Symbol('request')
class Authorization{
	static get hex(){ return require('./hex') }
	static get Key(){ return Key }
	static get token(){ return require('./token') }
	constructor(athenticator){
		this[authorization_request] = function authentication(request,response,next){
			let result = athenticator(read(request),request,response)
			if(result instanceof Promise){
				return result.then(x=>{
					result = get_result(x)
					if(result !== true) return response.json(result)
					next()
				}).catch(e=>{
					console.error(e)
					return response.json({message:'Authentication error'})
				})
			}
			else result = get_result(result)
			if(result !== true) return response.json(result)
			next()
		}
	}
	get key(){ return new Key() }
	get router(){ return get_router(this) }
}

//exports
module.exports = Authorization

//shared actions
function read(request){
	if(!request.headers.authorization) return null
	const base = request.headers.authorization.split(' ')[1]
	return Key.data(base)
}

function get_result(result){
	if(result === true) return true
	let type = typeof result
	if(result === null) type = false
	switch(type){
		case 'object':
			return result
			break
		case 'text':
			return {message:result}
			break
		default:
			return {message:'Invalid credentials.'}
			break
	}
}
function get_router(authorization){ return authorization[authorization_request] }
