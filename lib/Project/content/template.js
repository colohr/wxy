const fxy = require('fxy')
const template_folder = fxy.join(__dirname,'template')
const templates = fxy.tree(template_folder,true).items.only


//exports
module.exports = file=>{
	let name = fxy.basename(file)
	console.log({filename:name})
	if(has_template(name)) return get_template(name)
	return null
}


//shared actions

function get_template(name){
	for(let item of templates){
		if(item.name === name){
			if('template' in item) return item.template
			return item.template = item.content
		}
	}
	return null
}
function has_template(name){
	return templates.filter(item=>item.name === name)
}
