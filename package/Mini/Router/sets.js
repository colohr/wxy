const fxy = require('fxy')
//exports
module.exports = create_sets

//shared actions
function create_sets(router,extra){
	if(fxy.is.map(extra)) return extra
	const data = { setting:router.preset, options:null }
	if(fxy.is.data(extra)){
		if('setting' in extra) data.setting = fxy.as.one(data.setting,extra.setting)
		if('options' in extra) data.options = extra.options
	}
	return create_sets_data(data)
}

function create_sets_data({setting,options}){
	const data = new Map()
	if(setting.cache) data.set('Cache-Control',`public, ${setting.cache.control}`)
	if(fxy.is.data(options)) for(let name in options) data.set(name,options[name])
	if(!data.has('Content-Type')) data.set('Content-Type','application/javascript')
	return data
}
