const fxy = require('fxy')
const express = require('express')
const compression = require('compression')
const body_parser = require('body-parser')

//exports
module.exports = get_server

//shared actions
function get_server(cloud){
	let server = express()
	server.use(compression())
	if(cloud.parse_data) server = set_data_parser(server)
	
	let admin = cloud.admin
	if(admin) server = set_admin(server,admin)
	
	let statics = get_static_folders(cloud.statics,cloud.folder)
	for(let item of statics) server.use(...item)
	return server
}

function get_static_folders(folders,root_folder){
	const root = root_folder || '/'
	if(fxy.is.data(folders)){
		return Object.keys(folders).map(name=>{
			let path = folders[name]
			let routes = fxy.is.text(path)
			let value
			if(routes) {
				path = fxy.join(root, path)
				if(name.charAt(0) !== '/') name = `/${name}`
				value = [ name, express.static(path) ]
			}
			else {
				path = fxy.join(root, name)
				value = [ express.static(path) ]
			}
			return value
		})
	}
	return []
}

function set_admin(server,admin){
	server.use(admin.router)
	return server
}

function set_data_parser(server){
	let json = body_parser.json()
	let urlencoded = body_parser.urlencoded({ extended: false })
	server.use(json)
	server.use(urlencoded)
	return server
}