const fxy = require('fxy')
const convert = require('./convert')
const extensions = ['js','es6','es']
class Mini extends Map{
	static get convert(){ return convert  }
	constructor(cloud){
		super()
		let options = cloud.options.mini === true ? {}:cloud.options.mini
		options.compress = false
		options.mangle=false
		this.router = get_router(this,cloud)
		this.code = (id,code)=>{
			let item = {id}
			item.mini = convert.code(code,options)
			return this.set(id,item).get(id)
		}
		this.file = (file)=>{
			let item = convert(file,options)
			return this.set(item.get('path'),item).get(item.get('path'))
		}
	}
}

//exports
module.exports = Mini

//shared actions

function get_router(mini){
	return function mini_router(request,response,next) {
		let file = request.originalUrl
		if(is_es(file)){
			request.mini = mini
			request.es_file = file
		}
		next()
	}
}

function is_es(file){
	let extension = fxy.extname(file)
	if(extension){
		return extensions.includes(extension.replace('.',''))
	}
	return false
}