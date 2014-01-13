var redis = require('redis')


var RedisQ = function(opts) {
	var port = opts.port || 6379,
		host = opts.host || '127.0.0.1',
		options = opts.options || {};


	this.db = redis.createClient(port, host, options);
	this.key = 'wubwub-redis-q';
}
RedisQ.prototype.get = function(onLoad) {
	var l = this.db.lpop(this.key, onLoad);
}
RedisQ.prototype.put = function(link) {
	var that = this;
	this.db.get(link, function(err, existing) {
		if (existing) return;
		that.db.set(link, true);
		that.db.lpush(that.key, link);
	});

}

exports.RedisBackend = RedisQ;