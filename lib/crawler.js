/**
 * crawler: link crawler.
 *
 * 	queue: push/pop links to explore
 * 	route: do something with the link based on the rule
 */
var _ = require('underscore');
var request = require('request');
var trumpet = require('trumpet');
var url = require('url');
var domain = require('domain');



var Crawler = function(opts) {

	var isUrl = /^https?:/i;


	this._routeToExp = function(routes) {
		return _.map(routes, function(callback, route) {
			return [
				new RegExp(route, 'i'),
				callback
			]
		});
	};

	/**
	 * Whether or not any of the routes match the link
	 * @param  {String} link
	 * @param  {[[Regex, Callback]]} routes
	 * @return {Bool}
	 */
	this._contains = function(link, routes) {
		var matched = _.compact(routes.map(function(route) {
			var res = route[0].exec(link);
			return res && res.length > 0;
		}));
		var isMatch = _.reduce(matched,
			function(a, b) {
				return a || b
			}, false);
		return isMatch
	};


	/**
	 * Match the link against the routes and return the first callback
	 * that is matched or null if none are matched
	 * @param  {String} link
	 * @param  {[[Regex, Callback]]} routes
	 * @return {Function || null}
	 */
	this._getCallback = function(link, routes) {
		for (k in routes) {
			if (routes[k][0].exec(link)) {
				return routes[k][1];
			}

		}
	};


	/**
	 * Whether or not should follow the link given based on the routes
	 * @param  {String} link
	 * @return {Bool}
	 */
	this.shouldFollow = function(link) {
		var ignored = this._contains(link, this.ignoreRoutes);
		//If it matches a route to ignore, then we have nothing more to do here
		if (ignored) return false;

		var isTree = this._contains(link, this.treeRoutes);
		if (isTree) return true;
		var isLeaf = this._contains(link, this.leafRoutes);
		return isLeaf;
	};


	/**
	 * Place the link in storage for exploration at a later time
	 * @param  {Trumped link element} a
	 * @param  {urlparse} parent
	 * @return none
	 */
	this.enqueueLink = function(a, parent) {
		var that = this;

		a.getAttribute('href', function(value) {
			//Parse the link
			var link = url.parse(value);
			//Remove all the null values from it
			_.each(link, function(val, name) {
				if (!val) {
					delete link[name]
				}
			});
			//remove the hash
			delete link.hash
			//Extend the parent url with this one 
			link = _.extend(parent, link);

			//Turn it back into an absolute url
			var clean = url.format(parent);
			if (that.shouldFollow(clean)) {
				that.q.put(clean);
			}
		})
	};



	/**
	 * fetch a link from wherever it specified, enqueue all links if it's a tree link, and execute
	 * the first callback to match this link
	 * @param  {String} link
	 * @return {Stream}
	 */
	this.fetch = function(link) {
		var that = this;
		if (link && isUrl.exec(link)) {
			var tr = trumpet();
			//If this link is a tree route, then get all the link elements and 
			if (this._contains(link, this.treeRoutes) || _.contains(opts.seed, link)) {
				tr.selectAll('a', function(a) {
					var parent = url.parse(link);
					that.enqueueLink.call(that, a, parent)
				});
			}
			//Get all the callback that matches this link
			var cb = this._getCallback(link, this.leafRoutes) || this._getCallback(link, this.treeRoutes);
			cb && cb(tr, link);
			return request.get(link).pipe(tr);
		}
	};


	/**
	 * This is ugly, limit concurrency in a prettier way?
	 * @return {[type]}
	 */
	this.start = function() {
		var that = this;
		var openStreams = 0;
		var maxRetry = 10;
		var emptyQ = 0;

		var f = function() {
			openStreams++;
			that.q.get(function(e, link) {
				var d = domain.create();
				d.on('error', function(e) {
					opts.error && opts.error(e);
					openStreams--;
				});

				d.run(function() {
					var rStream = that.fetch(link);
					if (rStream) {
						rStream.on('close', function() {
							openStreams--;
						});
					}
				});
			});


		}

		var loop = function() {
			while (openStreams <= opts.concurrency) {
				f();
			}
			setTimeout(loop, 200);
		}
		loop();
	};



	//Convert the routes to regexps and cache them
	this.treeRoutes = this._routeToExp(opts.routes.tree);
	this.leafRoutes = this._routeToExp(opts.routes.leaf);
	//ignore is just a list of ignored urls
	//
	var toIgnore = {};
	opts.routes.ignore.map(function(route) {
		toIgnore[route] = function() {
			throw new Error("This route was ignored. Why is this being executed?");
		}
	});
	this.ignoreRoutes = this._routeToExp(toIgnore);


	//Make the backend
	this.q = opts.backend;

	//put the starting links in the backend
	var that = this;
	opts.seed.map(function(link) {
		that.q.put(link);
	});


}


exports.Crawler = Crawler;