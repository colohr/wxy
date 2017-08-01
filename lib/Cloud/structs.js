const fxy = require('fxy')


module.exports = get_structs

//shared actions
function get_structs(directory){
	if(!fxy.is.text(directory) || !fxy.exists(directory)) throw new Error(`The "${directory}" for structs does not exist.`)
	return fxy.tree(directory)
	          .items
	          .filter(item=>item.get('path').includes('.DS_Store') !== true)
	          .map(item=>{
                  item.graph = function(graph_struct){
	                    let url = get_url(this.name,graph_struct)
                        return require(this.get('path'))(url)
                  }
                  return item
              })
}

function get_url(name,struct){
	let url = []
	if(struct.url) url.push(`${struct.url}`)
	url.push(struct.main || '/')
	url.push(name)
	url.push(struct.graph || '/graph')
	let value = []
	url.forEach(path=>{
		if(struct.url && path === struct.url) return value.push(path)
		let parts = path.split('/').map(x=>x.trim()).filter(x=>x.length > 0)
		parts.forEach(x=>{
			value.push(x)
		})
	})
	return value.join('/')
}