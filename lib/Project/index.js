const fxy = require('fxy')
const structures = require('./structures')

class Project{
	static get folder(){ return get_project }
	static get content(){ return require('./content') }
	static get options(){ return get_project_options }
	static get structures(){ return structures }
	constructor(folder,options){
		this.folder = folder
		this.options = get_project_options(options)
	}
	add_file(...x){ return add_file(this,...x) }
	add_folder(...x){ return add_folder(this,...x) }
	create(){ return create(this) }
	get details_content(){ return this.options.details_content }
	get details_project(){ return this.options.details_project }
	join_folder(text){ return fxy.join(this.folder,text) }
	get name(){ return this.options.name }
	structure(name,...x){
		let structure = structures[name](...x)
		return structure.map(item=>this.join_folder(item))
	}
}

//exports
module.exports = Project

//shared actions
function add_folder(project,folder){
	return new Promise((success,error)=>{
		if(writable(project,folder)){
			return fxy.make_folder
			          .promise(folder)
			          .then(()=>success({folder,created:true}))
			          .catch(error)
		}
		return success({folder,created:false})
	})
}

function add_file(project,file,content){
	return new Promise((success,error)=>{
		if(writable(project,file)){
			content = get_file_content(project,file,content)
			return fxy.writeFile(file,content,'utf8')
			          .then(()=>success({file,created:true}))
			          .catch(error)
		}
		return success({file,created:false})
	})
}

function create(project){
	console.log(`\n•••••••••••••••••••
	Creating Project:
        folder -> "${project.folder}"
        name -> "${project.name}"`, '\n----------')
	
	let items = project.structure('project').map(get_action_item)
	let promises = []
	for(let item of items) promises.push(project[item.action](item.name))
	
	//return value
	return Promise.all(promises).then(results=>{
		console.log('\n•••••••••••••••••••\n')
		return {project,results}
	})
	
	//shared actions
	function get_action_item(name){
		let action = fxy.extname(name).length > 0 || fxy.basename(name).indexOf('.') === 0 ?
					 'add_file':'add_folder'
		console.log({name,action})
		return {
			name,
			action
		}
	}
}


function get_file_content(project,file,content){
	if(!fxy.is.nothing(content) && !fxy.is.text(content)){
		try{
			content = JSON.stringify(content,null,3)
		}catch(e){
			console.log(`Error in file content for file: "${file}"`)
			console.error(e)
		}
	}
	//return value
	return detail_content()
	
	//shared action
	function detail_content(){
		if(project.details_content){
			content =  Project.content(project,{file,content})
			console.log({content})
		}
		return content || ''
	}
}

function get_project(folder,options){
	if(!fxy.is.text(folder)) throw new Error(`Folder required to create a new project structure`)
	if(!fxy.exists(folder)) throw new Error(`Folder: "${folder}" for  new project structure does not exists`)
	return new Project(folder,options)
}

function get_project_options(options){
	options = fxy.is.data(options) ? options:{}
	return Object.assign({},{
		details_content:true,
		details_project:true,
		name:''
	},options)
}

function writable(project,item){
	if(!fxy.is.text(item)) return false
	return item.includes(project.folder) && fxy.exists(item) === false
}