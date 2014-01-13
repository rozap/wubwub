var Stack = function() {
	this._data = [];
	this._seen = {};
}

Stack.prototype.put = function(obj) {
	if (this._seen[obj]) {
		return;
	}
	this._seen[obj] = true;
	return this._data.push(obj);
}

Stack.prototype.get = function(onLoad) {
	onLoad(null, this._data.pop());
}



exports.SimpleBackend = Stack;