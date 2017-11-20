const fxy = require('fxy')
module.exports = fxy.tag.closure`
	(()=>{
		return {
			id:"${'id'}",
			event(namespace,type,data){
				try{
					if(!data) data = {}
					if(!namespace) namespace = this.id
					return namespace+"${'splitter'}"+type+"${'splitter'}"+JSON.stringify(data)
				}
				catch(e){
					console.error(e)
					return e
				}
			},
			listener(event){
				let message = this.message(event)
				if(this.listeners.has(message.namespace)){
					if(this.listeners.get(message.namespace).has(message.type)){
						this.listeners.get(message.namespace).get(message.type)(message.data)
					}
				}
				else console.log('No listener',message)
			},
			listeners:new Map(),
			message(event){
				try{
					let parts = event.data.split("${'splitter'}")
					let data = JSON.parse(parts[2])
					for(let name in data){
						if(name.indexOf('func')===0){
							data[name.replace('func','').trim()]=eval(data[name])
							delete data[name]
						}
					}
					return {
						data,
						event,
						namespace:parts[0],
						type:parts[1]
					}
				}
				catch(e){
					console.error(e)
					return e.message
				}
			},
			on(namespace){
				return (type,listener)=>{
					if(this.listeners.has(namespace)!==true) this.listeners.set(namespace,new Map())
					this.listeners.get(namespace).set(type,listener)
					return this
				}
			},
			send(namespace){
				return (type,data)=>{
					let event = this.event(namespace,type,data)
					this.socket.send(event)
					return this
				}
			}
			
		}
	})()
`