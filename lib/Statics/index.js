const fxy = require('fxy')
const get_cache = require('./cache')
const Static = require('./Static')

class Statics extends Set{
	constructor(folder,cache){
		super()
		this.folder = folder
		this.cache = get_cache(cache)
	}
	use(app){
		for(let folder of this) folder.use(app)
		return app
	}
}

//exports
module.exports = export_statics

//shared actions
function export_statics(cloud){
	let statics = new Statics(cloud.folder,cloud.cache)
	let folders = get_folders(statics,cloud.statics)
	for(let folder of folders) statics.add(folder)
	return statics
}

function get_folders(statics,data){
	let folders = []
	for(let name in data){
		let value = data[name]
		let route = get_route(value,name)
		let path = get_path(statics,value,name)
		let headers = get_headers(statics,value)
		folders.push(new Static(route,path,headers))
	}
	return folders
}

function get_headers(statics,value){
	let cache = statics.cache
	let headers = {}
	if(fxy.is.data(value)){
		if('age' in value) headers.age = value.age
		else if('cache' in value) headers = value.cache
	}
	return statics.cache.join(headers)
}

function get_path(statics,value,name){
	let path = null
	if(fxy.is.text(value)) path = fxy.resolve(statics.folder,value)
	else if(fxy.is.data(value)) {
		if('path' in value) path = fxy.resolve(statics.folder,value.path)
		else path = fxy.resolve(statics.folder,name)
	}
	else if(value === true) path = fxy.resolve(statics.folder,name)
	return path
}

function get_route(value,name){
	let route = null
	if(fxy.is.text(value)) route = value
	if(fxy.is.text(route) && route.charAt(0) !== '/') route = `/${name}`
	return route
}