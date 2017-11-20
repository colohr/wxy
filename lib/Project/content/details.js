const fxy = require('fxy')
const detail_types = {
	css:get_detail_type({
		comment:{
			start:'/*',
			end:'*/'
		}
	}),
	es:get_detail_type({
		comment:{
			start:'/*',
			end:'*/'
		}
	}),
	get es6(){ return this.es6 },
	graphql:get_detail_type({
		comment:'#'
	}),
	html:get_detail_type({
		comment:{
			start:'<!--',
			end:'-->'
		}
		
	}),
	get js(){ return this.es },
	json:false,
	struct:get_detail_type({
		detail_type:'js',
		template(name){
			return [
				`const fxy = require('fxy')`,
				`const sxy = require('sxy')`,
				`const Type = sxy.Type`,
				'\n\n',
				`class ${name} extends Type(\`\`){`,
				'}\n',
				'//exports',
				`module.exports = ${name}`,
				'',
				'//shared actions'
			].join('\n')
		}
	}),
	txt:false
}

//exports
module.exports = get_details

//shared actions
function get_date(){
	let date = new Date()
	return `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`
}

function get_detail_type(options){
	return (file,...comments)=>{
		let detail = ''
		if(options.template){
			let detail_type = detail_types[options.detail_type]
			let name = fxy.basename(file)
			if(name === 'index.js') fxy.basename(file.replace(name,''))
			let body = options.template(name)
			let comments = detail_type(file,...comments)
			detail = [comments,body].join('')
		}
		else detail = get_comment(...comments)
		return `${detail}\n`
	}
	//shared actions
	function get_comment(...comments){
		if(fxy.is.text(options.comment)){
			let joiner = `\n${options.comment}`
			return `${options.comment}${comments.join(joiner)}`
		}
		return [options.comment.start,'\n',comments.join('\n\t'),'\n',options.comment.end].join('')
	}
}

function get_file_type(file){ return fxy.extname(file).replace('.','').trim().toLowerCase() }

function get_details(project,file,type){
	type = fxy.is.text(type) ? type:get_file_type(file)
	if(type in detail_types && detail_types[type]){
		let project_details = get_project_details(project)
		return detail_types[type](file,...project_details)
	}
	
	return ''
}

function get_project_details(project){
	if(project.skip_details) return []
	let author = fxy.is.text(project.by) ? `by: ${project.by}`:''
	let name = project.name || ''
	let date = get_date()
	let header = [name,author.length ? ` ${author} -> ${date}`:` ${date}`].join('')
	let details = [header]
	if(fxy.is.text(project.details)) details.push(project.details)
	else if(fxy.is.array(project.details)) details = details.concat(project.details)
	return details
}