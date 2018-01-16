const express = require('express')

class Static{
	constructor(route,path,headers){
		this.route = route
		this.path = path
		this.headers = headers
	}
	get router(){ return this.valid ? express.static(this.path,this.headers):null }
	use(app){
		let values = this.values
		if(values.length)  app.use(...values)
		return app
	}
	get valid(){ return this.path !== null }
	get values(){ return [this.route,this.router].filter(item=>item !== null) }
}

//exports
module.exports = Static
