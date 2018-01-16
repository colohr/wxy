const fxy = require('fxy')
//exports
module.exports = get_cloud_ssl

//shared actions
function get_cloud_ssl(cloud,ssl){
	const SSL = fxy.is.text(ssl) ? get_ssl_value(cloud,ssl):ssl
	if(fxy.is.data(SSL)) return { value:SSL }
	else if(fxy.is.function(SSL)) return SSL(get_ssl())
	throw new Error(`app.ssl server options invalid`)
}

function get_ssl_value(cloud,ssl) {
	const ssl_location = fxy.exists(ssl) ? ssl:fxy.join(cloud.options.folder,ssl)
	if(!fxy.exists(ssl_location)) throw new Error(`app.ssl loader module: "${ssl_location}" not found in project folder`)
	return require(ssl_location)
}

function get_ssl(){
	const ssl = {}
	return {
		certificate(value){
			ssl.cert = value
			return this
		},
		get value(){ return ssl },
		key(value){
			ssl.key = value
			return this
		},
		set(options){
			Object.assign(ssl,options)
			return this
		}
	}
}