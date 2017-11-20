
const States = require('./States')
const code = require('./code')
const socket_id = Symbol.for('socket id')

class Socket extends Map{
	static get id(){ return socket_id }
	constructor(web_socket,sockets){
		super()
		this.socket = web_socket
		this.stats = get_stats(web_socket)
		
		this.on = (namespace,type,listener)=>{
			if(!this.has(namespace)) this.set(namespace,new Map())
			this.get(namespace).set(type,listener)
			return this
		}
		
		this.send = (namespace,type,data)=>{
			web_socket.send(get_event(namespace,type,data))
			return this
		}
		
		web_socket.on('message', event=>{
			let message = get_message(event,sockets.message_splitter)
			let listener = null
			if(this.has(message.namespace)){
				if(this.get(message.namespace).has(message.type)){
					listener = this.get(message.namespace).get(message.type)
				}
			}
			if(listener) listener(message)
			else sockets.route_message(web_socket,message)
		})
		
		web_socket.send(code({
			id:sockets.id(this),
			splitter:sockets.message_splitter
		}))
		
	}
	get connected(){ return this.stats.state === 'connected' }
	get id(){ return this[socket_id] }
	get ready(){ return this.size > 0 }
}

//exports
module.exports = Socket

//shared actions
function get_event(namespace,type,data,splitter='->'){
	try{ return `${namespace}${splitter}${type}${splitter}${JSON.stringify(data)}` }
	catch(e){ return e.message }
}

function get_stats(web_socket){
	return {
		get id(){ return web_socket._ultron !== null ? web_socket._ultron.id:null },
		get state(){ return get_state(web_socket) }
	}
}

function get_message(message,splitter='->'){
	try{
		let data = message.split(splitter || '->')
		return {data:JSON.parse(data[2]),namespace:data[0],type:data[1]}
	}
	catch(e){
		console.error(e)
		return e
	}
}

function get_state(web_socket){ return States[web_socket.readyState] }