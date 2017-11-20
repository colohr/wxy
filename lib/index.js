const wxy = {
	get Authority(){ return require('./Authority') },
	get Cloud(){ return require('./Cloud') },
	get Files(){ return require('./Files') },
	get Project(){ return require('./Project') },
	get Sockets(){ return require('./Sockets') },
	get Statics(){ return require('./Statics') },
	get Static(){ return require('./Statics/Static') }
}

//exports
module.exports = new Proxy(get_cloud,{
	get(o,name){
		if(name in wxy) return wxy[name]
		switch(name){
			case 'cache': return get_cache
			case 'cloud': return get_cloud
			case 'files': return get_files()
			case 'options': return get_options
			case 'router': return get_router
			case 'statics': return get_statics
			case 'template': return get_template()
			case 'toolbox': return get_toolbox()
		}
		return null
	}
})

//shared actions
function get_cache(x){ return wxy.Statics.cache(x) }
function get_cloud(folder){ return new wxy.Cloud(folder) }
function get_files(){ return wxy.Files.router }
function get_options(x){ return new wxy.Options(x) }
function get_router(){ return require('express').Router() }
function get_statics(){ return require('express').static }
function get_template(){ return wxy.Files.template }
function get_toolbox(){ return wxy.Cloud.toolbox }

