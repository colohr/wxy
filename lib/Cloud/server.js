const express = require('express')
const fxy = require('fxy')
const compression = require('compression')
const body_parser = require('body-parser')
const Statics = require('../Statics')

//exports
module.exports = get_server

//shared actions
function get_authority(cloud){
	const Authority = require('../Authority')
	cloud.authority = new Authority(cloud.folder,cloud.options.authority)
	const router = express.Router()
	const routers = cloud.authority.router
	for(let route of routers) router.use(route)
	return router
}

function set_data_parser(server){
	let json = body_parser.json()
	let urlencoded = body_parser.urlencoded({extended: false})
	server.use(json)
	server.use(urlencoded)
	return server
}

function get_server(cloud){
	let server = express()
	server.use(compression())
	if(cloud.parse_data) server = set_data_parser(server)
	if('session' in cloud.options) server.use(get_session(cloud))
	if('authority' in cloud.options) server.use(get_authority(cloud,server))
	return Statics(cloud).use(server)
}

function get_session(cloud){
	const session = fxy.is.data(cloud.options.session) ? cloud.options.session:{file:fxy.join(cloud.folder,cloud.options.session)}
	if('path' in session) {
		session.file = fxy.join(cloud.folder,session.path)
		delete session.path
	}
	return require('./session')(session,cloud.secure)
}