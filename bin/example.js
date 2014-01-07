#!/usr/bin/env node

"use strict";
var wubwub = require('wubwub')

wubwub.crawl({
	'routes': {
		//Routes that get called and crawling does not progress beyond
		'leaf': {
			'.*': function(tr) {
				tr.selectAll('div', function(div) {
					div.createReadStream().pipe(process.stdout);
				});
			},
		},
		//Routes that get called and all links are enqueued
		'tree': {
			'.*': function(tr) {
				tr.selectAll('div', function(div) {
					// div.createReadStream().pipe(process.stdout);
				});
			}
		},
		//Routes not to follow
		'ignore': [],

	},
	'seed': ['https://wikipedia.org/'],
	'concurrency': 30,
});