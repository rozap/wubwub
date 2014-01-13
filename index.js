var Crawler = require('./lib/crawler');
var SimpleBackend = require('./lib/simplebackend');
var RedisBackend = require('./lib/redisbackend');


module.exports = (function() {
	return {
		crawl: function(conf) {
			if (!conf.routes) throw new Error("Configuration does not contain routes!")
			if (!conf.seed) throw new Error("Configuration does not contain a seed url!")


			var crawler = new Crawler.Crawler(conf);
			crawler.start();

		},
		Crawler: Crawler.Crawler,
		Backends: {
			Simple: SimpleBackend.SimpleBackend,
			Redis: RedisBackend.RedisBackend
		}
	}
})();