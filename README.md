wubwub
======

simple web crawler with node. experimenting with streams.



### Here's a simple example

```javascript


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
					div.createReadStream().pipe(process.stdout);
				});
			}
		},
		//Routes not to follow
		'ignore': [],

	},
	'seed': ['https://wikipedia.org/'],
	'concurrency': 30,
});

```

##wat?
This example will start at wikipedia.org, and follow *any* link and print the contents of every div on every page to stdout

#### Routes
There are three kinds of routes, leaf routes, tree routes, and ignored routes. 

* Ignored routes: a regex in the ignored route list won't be fetched. This overrides any previous route spec, such that if a leaf and ignored route are matched, the route is ignored.
* Leaf routes: a leaf route is one that when matched, will call the callback specified but not enqueue any of the links on the page. 
* Tree route: a leaf route is one that when matched, will call the callback specified and enqueue all the links on the page (provided they aren't ignored and match one of the tree or leaf routes)


#### Concurrency
Specifies how many requests can be running at the same time

#### Seed
Specifies which URL to start crawling at



