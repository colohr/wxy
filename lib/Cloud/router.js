const express = require('express')
const body_parser = require('body-parser')
const { graphqlExpress, graphiqlExpress } = require('graphql-server-express')


module.exports = function graph_router(struct,options){
	
	if(!options) options = {}
	const router = express()
	router.use(
		options.path || '/graph',
		body_parser.json(),
		graphqlExpress({
			schema: struct.get('schema')
		}))
	
	router.use(
		options.ui || '/ui',
		graphiqlExpress({
			endpointURL: struct.url
		}))
	
	//this.delete('schema')
	//struct.delete('types')
	
	return router
}
