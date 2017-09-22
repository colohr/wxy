const fxy = require('fxy')
const Admin = require('../Admin')
const Options = require('./Options')

class Cloud extends Map{
	static get Admin(){ return Admin }
	static get Options(){ return Options }
	constructor(folder){
		super()
		this.options = new Options(folder)
		for(let name in this.options) this.set(name,this.options[name])
		this.server = require('./server')(this)
	}
	get admin(){ return get_admin(this) }
	get body_parser(){ return require('body-parser') }
	get cache(){ return get_cache(this) }
	get domain(){ return this.get('domain') }
	set domain(value){ return this.set('domain',value) }
	get fetch(){ return require('node-fetch') }
	get folder(){ return this.options.folder }
	get json(){ return this.options }
	get parse_data(){ return get_parse_data(this) }
	get port(){ return this.get('port') }
	set port(value){ return this.set('port',value)}
	post(...x){
		this.server.post(...x)
		return this
	}
	request(...x){
		this.server.get(...x)
		return this
	}
	get secure(){ return this.has('protocol') && this.get('protocol') === 'https' }
	get site(){ return get_site(this) }
	start(port,domain){
		if(fxy.is.nothing(port)) port = this.port
		else this.port = port
		if(fxy.is.text(domain)) this.domain = domain
		else if(domain === true) domain = this.domain
		let input = [port]
		if(fxy.is.text(domain)) input.push(domain)
		return new Promise(success=>{
			input.push(()=>{
				this.running = true
				return success(this)
			})
			return this.server.listen(...input)
		})
	}
	get statics(){ return get_statics(this) }
	get url(){ return this.options.url }
	use(...x){
		this.server.use(...x)
		return this
	}
	//prototype actions
	toString(){
		let message = `${this.running ? 'Running app at:\n':''}`
		message += this.url
		return message
	}
	
}

//exports
module.exports = Cloud


//shared actions
function get_admin(cloud){
	if(Admin.symbol in cloud) return cloud[Admin.symbol]
	if(cloud.has('admin')){
		let admin = cloud.get('admin')
		if(fxy.is.data(admin)){
			return cloud[Admin.symbol] = new Admin(admin.users,admin.path)
		}
	}
	return null
}

function get_cache(cloud){
	let cache = null
	if(cloud.has('cache') && fxy.is.data(cloud.get('cache'))) cache = cloud.get('cache')
	return cache
}

function get_parse_data(cloud){
	return cloud.has('parse_data') && cloud.get('parse_data') === true
}

function get_site(cloud){
	let site_value = cloud.has('site') ? cloud.get('site'):null
	if(!fxy.is.text(site_value)) site_value = 'site'
	return fxy.resolve(cloud.folder,site_value)
}

function get_statics(cloud){
	let statics = cloud.get('statics')
	if(fxy.is.data(statics)) return statics
	return {}
}


