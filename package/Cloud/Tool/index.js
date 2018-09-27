const Toolbox = {
	cloud:{ browser:require('./browser') },
	authority:require('../../Authority').tools,
	unique(uuid_type){ return this.authority.key.uid(uuid_type) }
}

//exports
module.exports.box = get_toolbox

//scope actions
function get_toolbox(){
	return new Proxy(Toolbox,{
		get(o,name){
			let value = get_value(name, o)
			if(!value){
				for(const type in o){
					if(o[type] && typeof o[type] === 'object') value = get_value(name, o[type])
					if(value) return value
				}
			}
			return value
		}
	})
	//scope actions
	function get_value(field, data){
		if(field in data === false) return null
		if(typeof data[field] === 'function') return data[field].bind(data)
		return data[field]
	}
}