const fxy = require('fxy')

class Cloud extends Map{
	static get Options(){ return require('./Options') }
	static get toolbox(){ return require('./Tool').box() }
	constructor(folder){
		super()
		this.options = folder
	}
	get cache(){ return get_cache(this) }
	get domain(){ return this.get('domain') }
	set domain(value){ return this.set('domain',value) }
	get folder(){ return this.options.folder }
	get form(){ return require('../Form') }
	get http_server(){ return require('./Server').HTTP(this) }
	get json(){ return this.options }
	get minis(){ return require('../Mini/Router').cloud(this) }
	get options(){ return this.constructor.Options.get(this) }
	set options(value){ return this.constructor.Options.set(this,value) }
	get port(){ return this.get('port') }
	set port(value){ return this.set('port',value)}
	get secure(){ return this.get('protocol') === 'https' }
	get server(){ return require('./Server').Middleware(this) }
	get site(){ return get_site(this) }
	get sockets(){ return get_sockets(this) }
	start(port,domain){ return get_start(this,port,domain) }
	get starter(){ return require('./Starter').get(this) }
	get statics(){ return get_statics(this) }
	get toolbox(){ return this.constructor.toolbox }
	get url(){ return this.options.url }
	get use(){ return get_use(this) }
	get wxy_name(){ return this.constructor.name }
	toString(){ return print_cloud(this) }
}

//exports
module.exports = Cloud

//scope actions
function get_cache(cloud){ return fxy.is.data(cloud.get('cache')) ? cloud.get('cache'):null }

function get_site(cloud){
	const site_value = fxy.is.text(cloud.get('site')) ? cloud.get('site'):'site'
	return fxy.resolve(cloud.folder,site_value)
}

function get_sockets(cloud){
	const setting = cloud.options.sockets
	if(setting){
		if(fxy.is.text(setting)){
			const file = fxy.exists(setting) ? setting:fxy.join(cloud.options.folder,setting)
			const sockets = require(file)
			return fxy.is.function(sockets) ? sockets(cloud):sockets
		}
		return setting
	}
	return null
}

function get_start(cloud,port,domain){
	if(fxy.is.nothing(port)) port = cloud.port
	else cloud.port = port
	if(fxy.is.text(domain)) cloud.domain = domain
	else if(domain === true) domain = cloud.domain
	const input = [port]
	if(fxy.is.text(domain)) input.push(domain)
	return new Promise(function cloud_listener(success){
		input.push(on_listen)
		return cloud.http_server.listen(...input)
		//shared actions
		function on_listen(){
			cloud.running = true
			return success(cloud)
		}
	})
}

function get_statics(cloud){
	const statics = cloud.get('statics')
	return fxy.is.data(statics) ? statics:{}
}

function get_use(...x){
	return function cloud_use(...router){
		return (x[0].server.use(...router),x[0])
	}
}

function print_cloud(cloud){
	if(cloud.running) return `Running "${cloud.wxy_name}" cloud at:\n${cloud.url}`
	return `Cloud "${cloud.wxy_name}" idle`
}







