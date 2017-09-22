const fxy = require('fxy')
const get_template = require('es6-template-strings/compile')
const set_template = require('es6-template-strings/resolve-to-string')

class FileTemplate{
	static get get(){ return require("es6-template-strings") }
	static get router(){ return require('./router') }
	static get template(){ return get_file_template() }
	constructor(file){
		this.file = file
		this.template = get_template(fxy.readFileSync(file,'utf8'))
	}
	get(data){
		return set_template(this.template,data)
	}
}

//exports
module.exports = FileTemplate
//module.exports.template = create_template
//module.exports.template.get = require("es6-template-strings")

//shared actions
function create_template(file){ return new FileTemplate(file) }
function get_file_template(){
	return new Proxy(create_template,{
		get(o,name){
			if(name in o) return o[name]
			else if(name === 'get') return FileTemplate.get
			return null
		}
	})
}
