const express = require('express')
const fxy = require('fxy')

class Files extends Array{constructor(...x){ super(...get_file_list(...x))}}

//exports
module.exports = get_files_router
module.exports.collection = get_collection_router

//shared actions
function get_collection_router(options){
	let targets = []
	let folders = options.folders || []
	for(let folder of folders) targets.push(get_files_router(folder))
	return targets
}

function get_file_data(item,{folder,url},files){
	let path = item.get('path').replace(folder,'')
	let data = {}
	data.file = item.name
	data.folder = fxy.dirname(path)
	data.name = get_file_name(item)
	data.path = fxy.join(fxy.basename(folder),path)
	data.type = item.type
	data.url = fxy.source.url(url,data.path)
	if(fxy.is.data(files) && files.content) data.content = item.content
	return data
}

function get_file_name(item){
	let name = item.name
	let extension = fxy.extname(name)
	item.type = extension.replace('.','')
	return name.replace(`${extension}`,'')
}

function get_file_tree({folder},params){
	if(fxy.is.text(params.folder)){
		let path = get_folder_paths(params.folder)
		let folder_path = fxy.resolve(folder,path)
		if(fxy.exists(folder_path)){
			let types = get_file_types(params)
			return fxy.tree(folder_path,...types)
		}
	}
	return null
}

function get_file_types({types}){
	if(fxy.is.text(types)) return types.split(',').map(type=>type.trim()).filter(type=>type.length)
	return []
}

function get_file_list(tree,options,files){
	let items = tree.items
	if(items.length) {
		items = items.only
		return items.map(item=>get_file_data(item,options,files))
		            .sort(item=>(a,b)=>{
						if(a.file > b.file) return 1
			            else if(a.file < b.file) return -1
			            return 0
					})
	}
	return []
}

function get_files(options,files){
	return function files_request(request,response,next){
		return get_request(request).then(json=>response.json(json)).catch(error=>{
			if(next) return next()
			return response.json(error)
		})
	}
	//shared actions
	function get_request(request){
		return new Promise((success,error)=>{
			let tree = get_file_tree(options,request.params)
			if(tree) return process.nextTick(()=>success(new Files(tree,options,files)))
			return error({error:{message:'Invalid wwi.files request',input:request.params}})
		})
	}
}

function get_files_router(options,router_name){
	const router = express.Router()
	let folder = options.folder
	router_name = router_name || fxy.basename(folder)
	let name = `${router_name}.files`
	router.get(`/${name}/:folder/:types`,get_files(options))
	router.get(`/${name}.content/:folder/:types`,get_files(options,{content:true}))
	return router
}

function get_folder_paths(folder){
	let paths = folder.split('>').map(item=>item.trim()).filter(item=>item.length)
	return fxy.join(...paths)
}

