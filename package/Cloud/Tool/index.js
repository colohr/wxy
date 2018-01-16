const Toolbox = {
	cloud:{ browser:require('./browser') },
	authority:require('../../Authority').tools,
	unique(uuid_type){ return this.authority.key.uid(uuid_type) }
}
//exports
module.exports.box = get_toolbox

//shared actions
function get_toolbox(){
	return new Proxy(Toolbox,{
		get(o,name){
			let value = null
			if(name in o) {
				value = o[name]
				if(typeof value === 'function') value = value.bind(o)
			}
			if(!value){
				for(let type in o){
					let box = o[type]
					if(fxy.is.data(box) && name in box){
						value = box[name]
						if(typeof value === 'function') value = value.bind(box)
					}
				}
			}
			return value
		}
	})
}