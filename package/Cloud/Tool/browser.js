
//exports
module.exports = get_web_browser

//shared actions
function get_web_browser(userAgent){
	let ua = userAgent
	let tem = null
	let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || []
	let type='desktop'
	let name = null
	
	if(/trident/i.test(M[1])){
		tem =  /\brv[ :]+(\d+)/g.exec(ua) || []
		name = 'IE '+(tem[1] || '')
	}
	
	if(M[1]=== 'Chrome'){
		tem = ua.match(/\b(OPR|Edge)\/(\d+)/)
		if(tem !== null) name = tem.slice(1).join(' ').replace('OPR', 'Opera')
	}
	
	M = M[2]? [M[1], M[2], M[0]]:M
	
	if(!M.length){
		M = ua.match(/(bot|crawler(?=\/))\/?\s*(\d+)/i) || []
		if(M.length) type='bot'
	}
	else{
		if( (tem = ua.match(/version\/(\d+)/i) ) !== null) M.splice(1, 1, tem[1])
		let mobile = ua.match(/(mobile|phone|mobi|android|tablet)\/?\s*(\d+)/i) || []
		if(mobile.length) type='mobile'
		else{
			let bot = ua.match(/(bot|crawler(?=\/))\/?\s*(\d+)/i) || [];
			if(bot.length) type='bot'
		}
	}
	
	//return value
	return {
		name:name === null ? M[0]:name,
		version:isNaN(M[1]) ? 0:parseFloat(M[1]),
		type,
		base:M.length >= 2 && type !== 'bot' ? M[2]:userAgent
	}
}