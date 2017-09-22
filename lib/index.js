const wxy = {
	get Authorization(){ return require('./Authorization') },
	get Cloud(){ return require('./Cloud') },
	get Files(){ return require('./Files') },
	get Plugs(){ return require('./Plugs') },
	get Statics(){ return require('./Statics') },
	get Static(){ return require('./Statics/Static') }
}

//exports
module.exports = new Proxy(get_cloud,{
	get(o,name){
		if(name in wxy) return wxy[name]
		switch(name){
			case 'cloud': return get_cloud
			case 'files': return get_files()
			case 'options': return get_options
			case 'router': return get_router
			case 'template': return get_template()
		}
		return null
	}
})

//shared actions
function get_cloud(folder){ return new wxy.Cloud(folder) }
function get_files(){ return wxy.Files.router }
function get_options(x){ return new wxy.Options(x) }
function get_router(){ return require('express').Router() }
function get_template(){ return wxy.Files.template }

