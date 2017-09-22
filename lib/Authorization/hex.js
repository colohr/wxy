const crypto = require('crypto')
const valid = require('./option').valid_text


//exports
module.exports = {
	create:create_hex,
	read:read_hex,
	verify:verify_hex
}

//shared actions
function create_hex(value,secret){
	return new Promise((success,error)=>{
		if(!valid(value) || !valid(secret)) return error(new Error('Invalid value for creating hex.'))
		const cipher = crypto.createCipher('aes256', secret)
		let encrypted = ''
		cipher.on('readable', () => {
			const data = cipher.read()
			if(data) encrypted += data.toString('hex')
		})
		cipher.on('end', () => success(encrypted))
		cipher.on('error',e=>error(e))
		cipher.write(value)
		cipher.end()
	})
}

function read_hex(value,secret){
	return new Promise((success,error)=>{
		if(!valid(value) || !valid(secret)) return error(new Error('Invalid value for reading hex.'))
		const decipher = crypto.createDecipher('aes256', secret)
		let decrypted = ''
		decipher.on('readable', () => {
			const data = decipher.read()
			if(data) decrypted += data.toString('utf8')
		})
		decipher.on('end', () => success(decrypted))
		decipher.on('error',e=>error(e))
		decipher.write(value,'hex')
		decipher.end()
	})
}


function verify_hex(hex_1,hex_2,secret){
	return new Promise((success,error)=>{
		if(!valid(hex_1) || !valid(hex_2)) return success(false)
		return read_hex(hex_2,secret).then(value=>success(value===hex_1)).catch(error)
	})
}