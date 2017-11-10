const fxy = require('fxy')
const wwi_options = Symbol('wwi options')
const sxy_options = Symbol('sxy options')

class Options {
	constructor(options) {
		let json = get_app_json(options)
		this.folder = json.folder
		Object.assign(this,json)
		
	}
	get sxy(){ return this[sxy_options] }
	set sxy(value){ return set_sxy(value,this) }
	get url(){ return get_url(this) }
	get wwi(){ return this[wwi_options] }
	set wwi(value){ return set_wwi(value,this) }
}


//exports
module.exports = Options


//shared actions
function get_app_json(value){
	let json = fxy.is.data(value) ? value:null
	let folder = null
	if(json === null) folder = value
	else folder = json.folder
	if(!fxy.is.text(folder)) throw new Error(`Could not create wxy.Cloud. The "folder" for project was not found.`)
	if(!fxy.exists(folder)) throw new Error(`Could not create wxy.Cloud. The "folder:${folder}" for project does not exist.`)
	if(!fxy.is.data(json)){
		let json_file = fxy.join(folder,'app.json')
		json = fxy.exists(json_file) ? require(json_file):{}
	}
	let default_app_json = require('./app.json')
	let app_json = Object.assign(default_app_json,json)
	if(!('folder' in app_json)) app_json.folder = folder
	
	//return value
	return app_json
}

function set_options(json){
	for (let name in json) {
		switch (name) {
			case 'sxy':
				this.sxy = get_sxy(json[name],this)
				break
			case 'wwi':
				this.wwi = get_wwi(json[name],this)
				break
			default:
				this[name] = json[name]
				break
		}
	}
}

function set_sxy(value,options){
	if(fxy.is.data(value)){
		value.structs = fxy.join(options.folder,value.structs)
		value.url=fxy.source.url(options.url,value.path)
	}
	return options[sxy_options] = value
}

function get_url(options){
	let port = 'port' in options && options.domain.includes('localhost') ? `:${options.port}`:''
	return fxy.source.url(options.protocol,options.domain+port,options.path)
}

function set_wwi(value,options){
	if(fxy.is.data(value)){
		if('components' in value && !(fxy.is.data(value.components))) value.components = {folders:[]}
		if('components' in value && 'folders' in value.components){
			let folders = []
			let components = value.components
			components.folder = options.folder
			let paths = typeof components.folders === 'string' ? [components.folders]:components.folders
			if(fxy.is.array(paths)){
				for(let path of paths){
					let folder = fxy.join(options.folder,path)
					folders.push({
						folder,
						path,
						get url(){ return options.url }
					})
				}
			}
			components.url = options.url
			components.folders = folders
		}
	}
	return options[wwi_options] = value
}
