const fxy = require('fxy')
const session = require('express-session')

//exports
module.exports = get_router

//shared actions
function get_options(options,secure){
	if(fxy.is.text(options)) options = {secret:options}
	if(!('secret' in options) && 'file' in options){
		options.secret = secret(options)
		delete options.file
	}
	if(!('cookie' in options)) options.cookie = {secure:fxy.is.TF(secure) ? secure:false ,maxAge:60000}
	if(!('resave' in options)) options.resave = false
	if(!('saveUninitialized' in options)) options.saveUninitialized = true
	return options
}

function get_router(data,secure){ return session(get_options(data,secure)) }

function secret(data){ return fxy.readFileSync(data.file,'utf8') }
