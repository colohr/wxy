const fxy = require('fxy')
const create_sets = require('./sets')
//exports
module.exports = create_route

//shared actions
function create_route(router,extra){
	const sets = create_sets(router,extra)
	const reader = get_reader(router,extra)
	return function mini_route(request,response,next){
		const content = reader(request)
		if(content){
			if(fxy.is.number(content)) return response.status(content).end()
			return set_response(response,sets).send(content)
		}
		return next()
	}
}

function get_reader(router,extra){
	if(fxy.is.data(extra) && fxy.is.function(extra.reader)) return extra.reader
	return request=>{
		if(request.es_file){
			const file = router.locator(request.es_file)
			if(!fxy.exists(file)) return 404
			const item = request.mini.has(file) ? request.mini.get(file):request.mini.file(file)
			return item.mini
		}
		return null
	}
}

function set_response(response,sets){
	for(let [field,value] of sets) response.set(field, value)
	return response
}