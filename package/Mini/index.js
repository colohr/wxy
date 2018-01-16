const extensions = ['js','es6','es']

class Mini extends Map{
	static get convert(){ return require('./convert')  }
	static get Router(){ return require('./Router') }
	constructor(cloud){
		super()
		this.options = get_options(cloud)
		this.router = get_router(this,cloud)
	}
	code(id,code){
		const item = {id}
		item.mini = this.constructor.convert.code(code,this.options)
		return this.set(id,item).get(id)
	}
	file(file){
		const item = this.constructor.convert(file,this.options)
		return this.set(item.get('path'),item).get(item.get('path'))
	}
}

//exports
module.exports = Mini

//shared actions
function get_options(cloud){
	const options = cloud.options.mini === true ? {}:cloud.options.mini
	options.compress = false
	options.mangle=false
	return options
}

function get_router(mini){
	return function mini_router(request,response,next) {
		const file = request.originalUrl
		if(is_es(file)){
			request.mini = mini
			request.es_file = file
		}
		next()
	}
}

function is_es(file){
	let extension = require('fxy').extname(file)
	if(extension) return extensions.includes(extension.replace('.',''))
	return false
}