console.log("wubwub!");
var Crawler = require('./crawler');



var isValidConf = function(conf) {
	if (!conf.routes) throw new Error("Configuration does not contain routes!")
	if (!conf.seed) throw new Error("Configuration does not contain a seed url!")

}


exports.crawl = function(conf) {
	isValidConf(conf);
	var crawler = new Crawler.Crawler(conf);
	crawler.start();
}