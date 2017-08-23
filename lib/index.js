const Cloud = require('./Cloud')
const Options = require('./Options')
//exports
module.exports = cloud_export
module.exports.Cloud = Cloud
module.exports.example = require('./example-app.json')
module.exports.Options = Options
module.exports.options = x=>new Options(x)
module.exports.router = get_router
module.exports.Static = require('./Statics/Static')
module.exports.template = require('./template')

//shared actions
function cloud_export(folder){ return new Cloud(folder) }
function get_router(){ return require('express').Router() }