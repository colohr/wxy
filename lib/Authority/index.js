const fxy = require('fxy')
const tools = require('./tools')
const basic_auth = require('basic-auth')
const api_request = Symbol('api request')
const user_request = Symbol('user request')

class Authority extends Map{
	static get tools(){ return tools }
	constructor(folder,options){
		super(get_map(folder,options))
		if('api' in options) this[api_request] = require(fxy.join(folder,options.api))
		if('user' in options) this[user_request] = require(fxy.join(folder,options.user))
		this.validate = get_validate(folder,options)
	}
	get router(){ return get_router(this) }
	get tools(){ return tools }
	validate_api(api,...x){
		if(api_request in this) return this[api_request](api,...x)
		return this.validate(api)
	}
	validate_user(user,...x){
		if(user_request in this) return this[user_request](user,...x)
		return this.validate(user)
	}
}

//exports
module.exports = Authority

//shared actions
function api_auth(request){
	if(!request.headers.authorization) return null
	const base = request.headers.authorization.split(' ')[1]
	return tools.key.data(base)
}

function get_map(folder,options){
	if(fxy.is.text(options.path) && options.path.charAt(0) === '/') options.path = options.path.replace('/','').trim()
	else options.path = ''
	let paths = 'paths' in options ? options.paths:[]
	if(fxy.is.text(paths)) paths = paths[paths]
	let realm = options.realm || tools.key.uid()
	return [['folder',folder],['path',options.path],['paths',paths],['realm',realm]]
	
}

function get_router(authority){
	return [(request,response,next)=>{
		if(matches(authority,request)){
			let validation = false
			let output = {
				message:authority.has('message') ? authority.get('message'):'Access denied',
				realm:authority.get('realm')
			}
			switch(request.method){
				case 'POST':
					output.type = 'json'
					validation = authority.validate_api(api_auth(request),request,response,next)
					break
				case 'GET':
					output.type = 'end'
					validation = authority.validate_user(basic_auth(request),request,response,next)
					break
			}
			
			if(validation === true) return next()
			else if(validation instanceof Promise){
				return validation.then((is_valid)=>{
					if(is_valid === true) return next()
					return invalid()
				}).catch(error=>{
					console.error(error)
					return invalid()
				})
			}
			
			return invalid()
			//shared actions
			function invalid(){
				response.statusCode = 401
				response.setHeader('WWW-Authenticate', `Basic realm="${output.realm}"`)
				response[output.type](output.message)
			}
		}
		return next()
	}]
}

function get_users(folder,options){
	let data = null
	if('users' in options) data = require(fxy.join(folder,options.users))
	const users = new Map()
	if(fxy.is.data(data)) for(let name in data) users.set(name,data[name])
	return users
}

function get_validate(folder,options){
	const users = get_users(folder,options)
	return function is_admin_user(credentials){
		return credentials && users.has(credentials.name) && users.get(credentials.name) === credentials.pass
	}
}

function matches(authority,request){
	const count = authority.get('paths').length
	if(count === 0) return true
	if(is_main_path(authority,request.path)){
		const secure = authority.get('paths').filter(path=>request.path.includes(path))
		if(secure.length) return true
	}
	return false
}

function is_main_path(authority,path){
	return true
	const first = path.split('/').filter(part=>part.length)[0] || '/'
	let main_path = authority.get('path')
	if(!main_path) main_path = '/'
	return first === main_path
}



//function get_admin(cloud){
//	const Admin = require('../Admin')
//	if(Admin.symbol in cloud) return cloud[Admin.symbol]
//	if(cloud.has('admin')){
//		let admin = cloud.get('admin')
//		if(fxy.is.data(admin)){
//			return cloud[Admin.symbol] = new Admin(admin.users,admin.path)
//		}
//	}
//	return null
//}

//this[authorization_request] = function authentication(request,response,next){
//	let result = athenticator(read(request),request,response)
//	if(result instanceof Promise){
//		return result.then(x=>{
//			result = get_result(x)
//			if(result !== true) return response.json(result)
//			next()
//		}).catch(e=>{
//			console.error(e)
//			return response.json({message:'Authentication error'})
//		})
//	}
//	else result = get_result(result)
//	if(result !== true) return response.json(result)
//	next()
//}