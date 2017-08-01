const auth = require('basic-auth');

const admin_symbol = Symbol('Admin')

class Admin extends Map{
	static get symbol(){ return admin_symbol }
	constructor(app_admin,main_path){
		if(typeof main_path === 'string' && main_path.charAt(0) === '/') main_path = main_path.replace('/','').trim()
		else main_path = ''
		super([['main path',main_path]])
		if('path' in app_admin){
			let paths = []
			if(typeof app_admin.path === 'string') paths =[app_admin.path]
			else if(Array.isArray(app_admin.path)) paths = app_admin.path
			this.set('paths',paths)
		}
		this.set('admins',require('./admins')(app_admin))
	}
	is_main_path(path){
		let first = path.split('/').filter(part=>part.length)[0]
		let main_path = this.get('main path')
		if(first === main_path) return true
		return false
	}
	get router(){ return get_router(this) }
	verify(user){ return this.get('admins')(user) }
}

module.exports = Admin

function get_router(admin){
	return (req,res,next)=>{
		if(matches(req,admin)){
			let user = auth(req)
			if(admin.verify(user)) return next();
			res.statusCode = 401
			res.setHeader('WWW-Authenticate', 'Basic realm="graph_ui"')
			return res.end('Access denied')
		}
		return next();
	}
}

function matches(req,admin){
	if(admin.is_main_path(req.path)){
		let secure = admin.get('paths').filter(path=>req.path.includes(path))
		if(secure.length) return true
	}
	return false
}
