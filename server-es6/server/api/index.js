import { Router } from 'express';
// import facets from './facets';
import {createBin} from './bins' 
import {createUser} from './users' 

export default function() {
	var api = Router();

	// mount the facets resource
	api.use('/facets', facets);

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({
			version : '1.0'
		});
	});

	api.get('/createBin', createBin)
	// api.get('/createUser', createUser)

	return api;
}
