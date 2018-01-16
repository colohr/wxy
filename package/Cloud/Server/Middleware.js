const express = require('express')
const fxy = require('fxy')
const cloud_middleware = Symbol('cloud middleware')

//exports
module.exports = cloud_express

//shared actions
function cloud_express(cloud){
	if(cloud_middleware in cloud) return cloud[cloud_middleware]
	return cloud[cloud_middleware] = get_middleware(cloud)
}

function get_authority(cloud){
	const Authority = require('../../Authority')
	cloud.authority = new Authority(cloud.folder,cloud.options.authority)
	const router = express.Router()
	const routers = cloud.authority.router
	for(let route of routers) router.use(route)
	return router
}

function get_cors(cloud){
	const cors = require('cors')
	let options = cloud.options.cors
	if(fxy.is.data(options)) return cors(options)
	return cors()
}

function get_express(cloud){
	const server = express()
	server.use(require('compression')())
	if('parse_data' in cloud.options){
		const body_parser = require('body-parser')
		server.use(body_parser.json())
		server.use(body_parser.urlencoded({extended: false}))
	}
	return server
}

function get_mini(cloud){
	const Mini = require('../../Mini')
	cloud.mini = new Mini(cloud)
	return cloud.mini.router
}

function get_middleware(cloud){
	const server = get_express(cloud)
	if('cors' in cloud.options) server.use(get_cors(cloud))
	if('session' in cloud.options) server.use(get_session(cloud))
	if('authority' in cloud.options) server.use(get_authority(cloud,server))
	if('mini' in cloud.options) server.use(get_mini(cloud,server))
	return require('../../Statics')(cloud).use(server)
}

function get_session(cloud){
	const session = fxy.is.data(cloud.options.session) ? cloud.options.session:{file:fxy.join(cloud.folder,cloud.options.session)}
	if('path' in session) {
		session.file = fxy.join(cloud.folder,session.path)
		delete session.path
	}
	return cloud.session = require('./Session')(session,cloud.secure)
}