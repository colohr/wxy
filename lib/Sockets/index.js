const WebSocket = require('ws')
const fxy = require('fxy')

const Socket = require('./Socket')
const web_sockets = Symbol('Web Sockets')

class Sockets{
	static get cloud(){ return get_cloud_sockets }
	static get server(){ return get_server }
	constructor(server,cloud){
		const connections = new WeakMap()
		const sockets = this
		let count = 0
		this.server = server
		this.id = socket=>get_socket_id(cloud,socket)
		this.route_message = (socket,message)=>{
			if('route' in this) this.route(connections.get(socket),message)
			else console.log(connections.get(socket),message)
		}
		
		this.start = ()=>{
			return new Promise((success)=>{
				this.server.on('connection', connection)
				this.interval = setInterval(ping, 30000)
				return success(this)
			})
		}
		this.count = ()=>count
		
		//shared actions
		function connection(web_socket,request){
			const headers = request.headers
			const browser = cloud.toolbox.browser(headers['user-agent'])
			const ip = request.connection.remoteAddress
			const cookie = headers.cookie
			web_socket.browser = browser
			web_socket.browser.ip = ip
			web_socket.browser.cookie = cookie
			web_socket.is_active = true
			web_socket.on('pong', pong)
			web_socket.on('close', function close() {
				remove_socket(this)
				count--
				console.log('disconnected -> sockets: ',count)
			})
			const socket = new Socket(web_socket,sockets)
			if('socket' in sockets) {
				sockets.socket(socket)
				//socket = sockets.socket()
				//if(!socket) throw new Error(`Sockets.socket must return back the newly connected socket`)
			}
			//else socket = new Socket(web_socket,sockets)
			connections.set(web_socket,socket)
			count++
		}
		function ping() {
			server.clients.forEach(function each(web_socket) {
				if (web_socket.is_active === false) return remove_socket(web_socket)
				web_socket.is_active = false
				web_socket.ping('', false, true)
			})
		}
		function pong() {this.is_active = true}
		function remove_socket(web_socket){
			connections.delete(web_socket)
			return web_socket.terminate()
		}
	}
	get message_splitter(){ return '->' }
	
}


//exports
module.exports = Sockets

//shared actions
function get_cloud_sockets(cloud){
	if(web_sockets in cloud) return cloud[web_sockets]
	let options = get_web_socket_options(cloud.options)
	options.server = cloud.http_server
	return cloud[web_sockets] =  new Sockets(get_server(options),cloud)
}

function get_server(options){
	return new WebSocket.Server(options)
}

function get_socket_id(cloud,socket){
	if(Socket.id in socket) return socket[Socket.id]
	return socket[Socket.id] = cloud.toolbox.unique()
}

function get_web_socket_options(data){
	return fxy.is.data(data) && 'sockets' in data ? data.sockets:{}
}