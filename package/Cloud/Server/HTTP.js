const fxy = require('fxy')
const cloud_http_server = Symbol('http server')

//exports
module.exports = get_http_server

//shared actions
function create_http_server(cloud){
	const ssl = cloud.has('ssl') ? (require('./SSL'))(cloud,cloud.get('ssl')):null
	const custom_http = cloud.has('http') ? load_http_server(cloud,ssl):null
	if(custom_http) return custom_http
	if(ssl) return require('https').createServer(ssl,cloud.server)
	return require('http').createServer(cloud.server)
}

function get_http_server(cloud){
	if(cloud_http_server in cloud) return cloud[cloud_http_server]
	return cloud[cloud_http_server] = create_http_server(cloud)
}

function load_http_server(cloud,...x){
	const http_server_location = fxy.exists(cloud.options.http) ? cloud.options.http:fxy.join(cloud.options.folder,cloud.options.http)
	if(!fxy.exists(http_server_location)) throw new Error(`app.http location does not exists: "${cloud.options.http}"`)
	return require(http_server_location)(...x,cloud)
}