'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

exports.default = function () {
	var api = (0, _express.Router)();

	// mount the facets resource
	api.use('/facets', facets);

	// perhaps expose some API metadata at the root
	api.get('/', function (req, res) {
		res.json({
			version: '1.0'
		});
	});

	api.get('/createBin', _bins.createBin);
	// api.get('/createUser', createUser)

	return api;
};

var _express = require('express');

var _bins = require('./bins');

var _users = require('./users');
//# sourceMappingURL=index.js.map