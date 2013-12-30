var assert = require("assert")

var _ = require('underscore');
var path = require('path');
var fs = require('fs');
var lib = path.join(path.dirname(fs.realpathSync(__filename)), '../lib');

var crawler = require(lib + '/crawler.js');


describe('Crawler', function() {

	describe('#contains()', function() {

		var cr;
		beforeEach(function() {
			cr = new crawler.Crawler({
				'routes': {
					'leaf': {},
					'tree': {},
					'ignore': []
				},
				'seed': ['https://github.com/']
			});

		});

		it('should return false if none of the routes match the link', function() {
			assert.equal(cr._contains('https://github.com/', []), false);
			assert.equal(cr._contains('https://github.com/', [
				[new RegExp('http://google.com'),
					function() {}
				]
			]), false);
		});
		it('should return true if at least of the routes matches the link', function() {
			assert.equal(cr._contains('https://github.com/', [
				[new RegExp('https://github.*'),
					function() {},
					new RegExp('http://google.com'),
					function() {}
				]
			]), true);
		})

	})


	describe('#routeToExp()', function() {

		var cr;
		beforeEach(function() {
			cr = new crawler.Crawler({
				'routes': {
					'leaf': {},
					'tree': {},
					'ignore': []
				},
				'seed': ['https://github.com/']
			});

		});

		it('should convert an key:value mapping of routes:callbacks to a 2d array', function() {

			var routes = {
				'foo': function(foo) {
					assert.equal(foo, 'foo')
				},
				'bar+': function(barr) {
					assert.equal(barr, 'barr')
				},
				'baz?': function(ba) {
					assert.equal(ba, 'ba')
				}
			}
			var keys = ['foo', 'barr', 'ba'];
			var arr = cr._routeToExp(routes);
			var z = _.zip(keys, arr);
			z.map(function(el) {
				var cb = el[1][1];
				cb(el[0]);
			})


		});



	})

	describe('#getCallback()', function() {

		var cr;
		beforeEach(function() {
			cr = new crawler.Crawler({
				'routes': {
					'leaf': {
						'.*github.*': 'firstToMatch',
						'.*google.*': 'secondToMatch'
					},
					'tree': {},
					'ignore': []
				},
				'seed': ['https://github.com/']
			});

		});

		it('should return the first callback of a matched link', function() {
			assert.equal(cr._getCallback('http://github.com', cr.leafRoutes), 'firstToMatch');
			assert.equal(cr._getCallback('http://google.com', cr.leafRoutes), 'secondToMatch');
		});

		it('should return null if none are matched', function() {
			assert.equal(cr._getCallback('http://someothersite.com', cr.leafRoutes), null);
		});


	})

});