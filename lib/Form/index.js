const Environment = require('./Environment')
const Line = require('./Line')
//exports
module.exports = input=>({
	get directory(){ return input.cwd() },
	environment:Environment(input),
	get file(){ return input.argv[0] },
	get files(){ return input.argv.filter(x=>!Line.is_item(x)) },
	json(data){ return get_json(this,data) },
	line:Line(input),
	get port(){ return this.environment.port }
})

//shared actions
function get_json(form,data){
	const line = form.line
	data = set_line(line,data)
	data.port = form.port || data.port || 8888
	return data
}

function set_line(line,data){
	if(line.local) {
		data.domain = 'localhost'
		data.protocol = 'http'
	}
	for(let name in line){
		if(name in data) data[name] = line[name]
	}
	return data
}