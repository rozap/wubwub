var Stack = function() {
	this._data = [],
	this._seen = {},

	this.put = function(obj) {
		if (this._seen[obj]) {
			return;
		}
		this._seen[obj] = true;
		return this._data.push(obj);
	}

	this.get = function() {
		return this._data.pop();
	}

};

exports.Backend = Stack;