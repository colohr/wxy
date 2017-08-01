
const Cloud = require('./Cloud')
module.exports = cloud_export
module.exports.example = require('./example-app.json')

//shared actions
function cloud_export(folder){ return new Cloud(folder) }
