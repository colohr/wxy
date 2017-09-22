const fxy = require('fxy')

class Options {
	constructor(options) {
		let json = get_app_json(options)
		this.folder = json.folder
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
	get url(){
		let port = 'port' in this && this.domain.includes('localhost') ? `:${this.port}`:''
		return fxy.source.url(this.protocol,this.domain+port,this.path)
	}
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

function get_sxy(value,options){
	if(fxy.is.data(value)){
		value.structs = fxy.join(options.folder,value.structs)
		value.url=fxy.source.url(options.url,value.path)
	}
	
	return value
}

function get_wwi(value,options){
	if(fxy.is.data(value)){
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
	return value
}
