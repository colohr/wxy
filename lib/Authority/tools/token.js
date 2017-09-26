const fxy = require('fxy')
const jwt = require('jsonwebtoken')

//exports
module.exports = {
	create:create_token,
	verify:verify_token
}

//shared actions
function create_token(data,secret,expiration){
	if(!fxy.is.data(data)) throw new Error('Invalid data for token.')
	return jwt.sign({data}, secret, { expiresIn: fxy.is.text(expiration) ? expiration:'1h'  })
}

function verify_token(token,secret){
	return new Promise((success,error)=>{
		return jwt.verify(token, secret(), function(e, decoded) {
			if(e) return error(e)
			return success(decoded)
		})
	})
}