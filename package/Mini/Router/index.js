const fxy = require('fxy')
const minis = Symbol('MiniRouter')
class MiniRouter{
	constructor(preset){ this.preset = fxy.is.data(preset) ? preset:{} }
	get cloud(){ return get_cloud_minis(this) }
	get location(){ return this.preset.location ? this.preset.location:process.env.PWD }
	locator(...x){ return fxy.join(this.location,...x) }
	route(extra){ return require('./route')(this,extra) }
}

//exports
module.exports = MiniRouter
module.exports.cloud = create_mini_cloud_router

//shared action
function create_mini_cloud_router(cloud){
	if(cloud.has(minis)) return cloud.get(minis).cloud(cloud)
	const preset = fxy.is.data(cloud.options.minis) ? cloud.options.minis:{}
	if(!fxy.is.text(preset.location)) preset.location = cloud.options.folder
	return cloud.set(minis,new MiniRouter(preset)).get(minis).cloud(cloud)
}

function get_cloud_minis(router){
	return function mini_cloud(cloud,extra){
		if(!cloud.has('mini')) throw new Error(`MiniRouter: cloud.mini is not set.  Add app.mini=true to the app.json`)
		const routes = new Set()
		routes.remove = ()=>cloud.delete(minis)
		routes.done = set_routes
		routes.router = ()=>router
		routes.set = add_route
		return routes
		//shared actions
		function add_route(...x){
			return this.add(get_route_inputs(
				get_route_path(...x),
				router.route(get_route_extras(extra,...x))
			))
		}
		function set_routes(){ return set_cloud_routes(cloud,this) }
	}
}

function get_route_extras(extra,...x){
	const route_extras = x.filter(i=>fxy.is.data(i))[0]
	if(fxy.is.data(route_extras)) return fxy.as.one({},extra,route_extras)
	return extra
}

function get_route_inputs(...x){ return x.filter(i=>fxy.is.nothing(i)===false) }

function get_route_path(...x){ return x.filter(i=>fxy.is.text(i))[0] }

function set_cloud_routes(cloud,routes){
	for(const route of routes) cloud.use(...route)
	return cloud
}











