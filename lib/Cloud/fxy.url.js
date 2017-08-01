const fxy = require('fxy')
const fxy_url = {
	create(...x){ return new this.URL(...x) },
	get default_options(){
		return {
			protocol: null,
			slashes: null,
			auth: null,
			host: null,
			port: null,
			hostname: null,
			hash: null,
			search: null,
			query: null,
			pathname: null,
			href: null
		}
	},
	fix:{
		hostname(value){
			if(fxy.is.text(value) !== true) return 'localhost'
			return value
		},
		pathname(value){
			if(fxy.is.text(value)){
				value = value.trim()
				if(value.charAt(0) !== '/') return `/${value}`
			}
			return null
		},
		protocol(value){
			if(fxy.is.text(value) !== true) return 'http'
			return value
		}
	},
	format(data){ return require('url').format(data) },
	options(data){
		if(!fxy.is.data(data)) data = {}
		let value = Object.assign(this.default_options,data)
		for(let name in value){
			let data_value = value[name]
			if(name in this.rename) {
				value[this.rename[name]] = data_value
				delete value[name]
			}
		}
		for(let name in value){
			if(name in this.fix) value[name] = this.fix[name](value[name])
		}
		return value
	},
	parse(...x){ return require('url').parse(...x) },
	rename:{
		path:'pathname'
	},
	get URL(){ return require('url').URL }
}

//exports
module.exports = fxy_url