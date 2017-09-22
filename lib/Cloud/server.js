const express = require('express')
const fxy = require('fxy')
const compression = require('compression')
const body_parser = require('body-parser')
const Statics = require('../Statics')

//exports
module.exports = get_server

//shared actions
function set_admin(server,admin){
	server.use(admin.router)
	return server
}

function get_authorization(cloud,server){
	const Authorization = require('../Authorization')
	const options = cloud.options.authorization
	if(!fxy.is.data(options) || !options.file) return
	const file = fxy.join(cloud.folder,options.file)
	const router = new Authorization(require(file)).router
	if(options.paths) options.paths.forEach(path=>server.use(path,router))
	else server.use(router)
}

function set_data_parser(server){
	let json = body_parser.json()
	let urlencoded = body_parser.urlencoded({ extended: false })
	server.use(json)
	server.use(urlencoded)
	return server
}

function get_server(cloud){
	let server = express()
	server.use(compression())
	if('session' in cloud.options) server.use(get_session(cloud))
	if('authorization' in cloud.options) get_authorization(cloud,server)
	if(cloud.parse_data) server = set_data_parser(server)
	let admin = cloud.admin
	if(admin) server = set_admin(server,admin)
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