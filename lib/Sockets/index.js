const WebSocket = require('ws')
const fxy = require('fxy')
const web_sockets = Symbol('Web Sockets')

const Sockets = {
	get cloud(){ return get_cloud_sockets },
	get server(){ return get_server }
}

//exports
module.exports = Sockets

//shared actions
function get_cloud_sockets(cloud){
	if(web_sockets in cloud) return cloud[web_sockets]
	let options = get_web_socket_options(cloud.options)
	options.server = cloud.http_server
	return cloud[web_sockets] = get_server(options)
}

function get_server(options){
	return new WebSocket.Server(options)
}

function get_web_socket_options(data){
	return fxy.is.data(data) && 'sockets' in data ? data.sockets:{}
}