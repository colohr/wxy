const fxy = require('fxy')
const get_template = require('es6-template-strings/compile')
const set_template = require('es6-template-strings/resolve-to-string')

//const code_file = fxy.join(__dirname,'code.es6')
//const code_template = get_template(fxy.readFileSync(code_file,'utf8'))
class FileTemplate{
	constructor(file){
		this.file = file
		this.template = get_template(fxy.readFileSync(file,'utf8'))
	}
	get(data){
		return set_template(this.template,data)
	}
}

//exports
module.exports = file=>new FileTemplate(file)
module.exports.File = FileTemplate
module.exports.get = require("es6-template-strings")