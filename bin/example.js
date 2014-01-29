#!/usr/bin/env node

"use strict";
var wubwub = require('wubwub')



wubwub.crawl({
	'routes': {
		//Routes that get called and crawling does not progress beyond
		'leaf': {
			'.*en.wikipedia.org/wiki/.*': function(tr, link) {
				tr.selectAll('p', function(div) {
					var st = div.createReadStream(),
						data = '';


					st.on('data', function(chunk) {
						data += chunk;
					})
					st.on('end', function() {
						data = data.replace(/<.*?>/g, '');
						console.log(data);

					});
					// div.createReadStream().pipe(process.stdout);
				});
			},
		},
		//Routes that get called and all links are enqueued
		'tree': {
			'.*en.wikipedia': function(tr, link) {}
		},
		//Routes not to follow
		'ignore': [],



	},
	'seed': ['http://en.wikipedia.org/wiki/Earth'],
	'concurrency': 50,
	'backend': new wubwub.Backends.Simple()
});