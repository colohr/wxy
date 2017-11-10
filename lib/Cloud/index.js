const fxy = require('fxy')
const Options = require('./Options')

const cloud_options = Symbol('options')
const cloud_server = Symbol('server')
const cloud_http_server = Symbol('http server')

class Cloud extends Map{
	static get Options(){ return Options }
	constructor(folder){
		super()
		this.options = folder
	}
	get body_parser(){ return require('body-parser') }
	get cache(){ return get_cache(this) }
	get domain(){ return this.get('domain') }
	set domain(value){ return this.set('domain',value) }
	get fetch(){ return require('node-fetch') }
	get folder(){ return this.options.folder }
	get http_server(){ return get_http_server(this) }
	get json(){ return this.options }
	get options(){ return this[cloud_options] }
	set options(value){ return set_options(this,value) }
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
	get server(){ return get_server(this) }
	get site(){ return get_site(this) }
	get sockets(){ return require('../Sockets').cloud(this) }
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
			return this.http_server.listen(...input)
		})
	}
	get statics(){ return get_statics(this) }
	get url(){ return this.options.url }
	use(...x){
		this.server.use(...x)
		return this
	}
	get wxy_name(){ return this.constructor.name }
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
function get_cache(cloud){
	let cache = null
	if(cloud.has('cache') && fxy.is.data(cloud.get('cache'))) cache = cloud.get('cache')
	return cache
}

function get_http_server(cloud){
	if(cloud_http_server in cloud) return cloud[cloud_http_server]
	return cloud[cloud_http_server] = require('http').createServer(cloud.server)
}

function get_parse_data(cloud){
	return cloud.has('parse_data') && cloud.get('parse_data') === true
}

function get_server(cloud){
	if(cloud_server in cloud) return cloud[cloud_server]
	return cloud[cloud_server] = require('./server')(cloud)
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

function set_options(cloud,value){
	let is_options = fxy.is.data(value) && value instanceof Options
	let options = is_options ? value : new Options(value)
	for(let name in options) cloud.set(name, options[name])
	return cloud[cloud_options] = options
}

