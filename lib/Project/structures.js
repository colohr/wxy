const structures = {
	project:()=>`
		package
		package/index.js
		public
		public/design
		public/design/index.css
		public/library
		public/logic
		public/logic/service-worker.js
		public/pages
		public/custom-elements.html
		public/index.html
		public/manifest.json
		structs
		test
		test/index.js
		app.json
		index.js
		nodemon.json
		.gitignore
		.npmignore
	`,
	struct:(item)=>`
		structs/${item.name}
		structs/${item.name}/Instruct
		structs/${item.name}/Instruct/Instruct.graphql
		structs/${item.name}/index.js
	`
}

//exports
module.exports = new Proxy(structures,{
	get(o,name){
		let value = null
		if(name in o) value = (...x)=>get_list(name,...x)
		return value
	},
	has(o,name){return name in o}
})


//shared actions
function get_list(name,...x){
	let structure_text = structures[name](...x)
	return structure_text
			.split('\n')
			.map(line=>line.trim())
			.filter(line=>line.length)
}
