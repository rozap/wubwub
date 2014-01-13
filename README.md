wubwub
======

simple web crawler with node. experimenting with streams.



### Here's a simple example

```javascript

wubwub.crawl({
        'routes': {
                //Routes that get called and crawling does not progress beyond
                'leaf': {
                        '.*en.wikipedia.org/wiki/.*': function(tr, link) {
                                tr.selectAll('p', function(div) {
                                        div.createReadStream().pipe(process.stdout);
                                });
                        },
                },
                //Routes that get called and all links are enqueued
                'tree': {
                        '.*en.wikipedia.org/wiki/.*': function(tr, link) {}
                },
                //Routes not to follow
                'ignore': [],



        },
        'seed': ['http://en.wikipedia.org/wiki/Earth'],
        'concurrency': 50,
        'backend': new wubwub.Backends.Simple()
});
```

##wat?
This example will start at wikipedia.org, and follow *any* link and print the contents of every p element on every leaf page to stdout

#### Routes
There are three kinds of routes, leaf routes, tree routes, and ignored routes. 

* Ignored routes: a regex in the ignored route list won't be fetched. This overrides any previous route spec, such that if a leaf and ignored route are matched, the route is ignored.
* Leaf routes: a leaf route is one that when matched, will call the callback specified but not enqueue any of the links on the page. 
* Tree route: a leaf route is one that when matched, will call the callback specified and enqueue all the links on the page (provided they aren't ignored and match one of the tree or leaf routes)

#### Callbacks
Callbacks in the leaf and tree routes are passed a [trumpet](https://github.com/substack/node-trumpet) instance for the page that was just fetched, as well as the url that was matched. 


#### Concurrency
Specifies how many requests can be running at the same time

#### Seed
Specifies which URL to start crawling at

#### Backend
Controls how links are enqueued for crawling. Two are included, wubwub.Backends.Simple() and wubwub.Backends.Redis() which implement put() and get(onLink) methods for links, and keep track of what URLs have already been seen. You can implement your own backend as long as it implements those methods. get() is async and takes a callback to be executed once the link is fetched. 



