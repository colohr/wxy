const cloud_starter = Symbol('Starter')
class Starter{
	constructor(cloud){
		let after = new Set()
		let before = new Set()
		let current = before
		
		this.after = add_after
		this.before = add_before
		this.start = cloud_start
		
		//shared actions
		function add_after(action){
			after.add(action)
			return this
		}
		
		function add_before(action){
			before.add(action)
			return this
		}
		
		function cloud_start(...x){
			return new Promise((success,error)=>{
				return process.nextTick(next)
				//shared actions
				function next(){
					for(const action of current){
						current.delete(action)
						return get_result(cloud,action).then(()=>process.nextTick(next)).catch(error)
					}
					if(current === before){
						current = after
						before = null
						return cloud.start(...x).then(()=>process.nextTick(next)).catch(error)
					}
					else after = null
					current = null
					console.log(`${cloud}`)
					delete cloud[cloud_starter]
					return success(cloud)
				}
			})
		}
	}
}

//exports
module.exports.get = get_starter

//shared actions
function get_result(cloud,action){
	try{
		const result = action(cloud)
		return  result instanceof Promise ? result:Promise.resolve(result)
	}
	catch(e){ return Promise.reject(e) }
}

function get_starter(cloud){
	if(cloud.listening) return null
	if(cloud_starter in cloud) return cloud[cloud_starter]
	return cloud[cloud_starter] = new Starter(cloud)
}