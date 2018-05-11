const fxy = require('fxy')
const {is} = fxy
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
		if(process.argv.includes('--local')) this.domain = 'localhost'
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
	const folder = get_json_folder(value)
	const json = Object.assign(require('./app.json'),get_json_content(value,folder))
	if('folder' in json === false) json.folder = folder

	//returning value
	return load_required()

	//shared actions
	function load_required(){
		for(const field in json){
			if(is_required(field)){
				json[field.substring(0,field.length-1)] = require(get_location(json[field]))
				delete json[field]
			}
		}
		return json
	}
	function get_location(location){
		const local_location  = fxy.join(folder, location)
		if(is_absolute()) return location
		return local_location
		//shared actions
		function is_absolute(){ return fxy.exists(location) && fxy.exists(local_location) === false }
	}
	function is_required(field){ return field.charAt(field.length - 1) === '@' }
}

function get_json_content(value,folder){
	if(is.data(value)) return value
	const file = fxy.join(folder, 'app.json')
	return fxy.exists(file) ? require(file):{}
}

function get_json_folder(value){
	const folder = is.data(value) ? value.folder:value
	if(!is.text(folder)) throw new Error(`Could not create wxy.Cloud. The "folder" for project was not found.`)
	if(!fxy.exists(folder)) throw new Error(`Could not create wxy.Cloud. The "folder:${folder}" for project does not exist.`)
	return folder
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



