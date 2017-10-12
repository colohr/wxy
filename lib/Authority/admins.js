//exports
module.exports = get_authorizer

//shared actions
function get_authorizer(admin){
	let users
	if(typeof admin === 'object' && admin !== null && 'users' in admin){
		users = get_users(admin.users)
	}
	else users = new Map()
	return function is_admin_user(credentials){
		if (credentials && users.has(credentials.name) && users.get(credentials.name) === credentials.pass) return true
		return false
	}
}

function get_users(data){
	const users = new Map()
	if(typeof data === 'object' && data !== null){
		for(let key in data){
			users.set(key,data[key])
		}
	}
	return users
}

