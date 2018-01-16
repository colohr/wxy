const fxy = require('fxy')
const cloud_options = Symbol('options')
const optionals = { sxy:Symbol('sxy options'), wwi:Symbol('wwi options') }

class Options {
	static get get(){ return get_cloud_options }
	static get set(){ return set_cloud_options }
	constructor(options) {
		const json = get_json(options)
		this.folder = json.folder
		Object.assign(this,json)
		if(!('port' in this)) this.port = process.env.PORT || 8080
		if(fxy.is.data(this.local) && process.argv.includes('--local')) Object.assign(this,this.local)
	}
	get sxy(){ return get_option(this,'sxy') }
	set sxy(value){ return set_option(this,'sxy',value) }
	get url(){ return get_url(this) }
	get wwi(){ return get_option(this,'wwi') }
	set wwi(value){ return set_option(this,'wwi',value) }
}

//exports
module.exports = Options

//shared actions
function get_cloud_options(cloud){ return cloud[cloud_options] }

function get_json(value){
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

function get_option(options,type){ return options[optionals[type]] }

function get_url(options){
	const port = 'port' in options && options.domain.includes('localhost') ? `:${options.port}`:''
	return fxy.source.url(options.protocol,`${options.domain}${port}`,options.path)
}

function set_cloud_options(cloud,value){
	const is_options = fxy.is.data(value) && value instanceof Options
	const options = is_options ? value : new Options(value)
	for(const name in options) cloud.set(name, options[name])
	return cloud[cloud_options] = options
}

function set_option(options,type,value){
	const option = optionals[type]
	switch(type){
		case 'sxy': return set_sxy()
		case 'wwi': return set_wwi()
	}
	return value
	
	//shared actions
	function set_sxy(){
		if(fxy.is.data(value)){
			value.structs = value.structs.includes(options.folder) ? value.structs:fxy.join(options.folder,value.structs)
			value.url = fxy.source.url(options.url,value.path)
		}
		return options[option] = value
	}
	
	function set_wwi(){
		if(fxy.is.data(value)){
			if('components' in value && !(fxy.is.data(value.components))) value.components = {folders:[]}
			if('components' in value && 'folders' in value.components){
				const folders = []
				const components = value.components
				components.folder = options.folder
				const paths = typeof components.folders === 'string' ? [components.folders]:components.folders
				if(fxy.is.array(paths)){
					for(const item of paths){
						let path = item
						if(fxy.is.data(item) && 'path' in item) path = item.path
						if(fxy.is.text(path)){
							folders.push({
								folder:fxy.join(options.folder,path),
								path,
								get url(){ return options.url }
							})
						}
					}
				}
				components.url = options.url
				components.folders = folders
			}
		}
		return options[option] = value
	}
}




function options_removed(){
	//const wwi_options = Symbol('wwi options')
	//const sxy_options = Symbol('sxy options')
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
}
