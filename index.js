var Crawler = require('./lib/crawler');


module.exports = (function() {
	return {
		crawl: function(conf) {
			if (!conf.routes) throw new Error("Configuration does not contain routes!")
			if (!conf.seed) throw new Error("Configuration does not contain a seed url!")


			var crawler = new Crawler.Crawler(conf);
			crawler.start();

		},
		Crawler: Crawler.Crawler
	}
})();