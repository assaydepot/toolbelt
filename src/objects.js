module.exports = {
	flatten: require('./core').flatten,
	values: function(obj) {
		return module.exports.keys(obj).map(function(key) {
			return obj[key];
		});
	},
	
	uniqueDocs: function(docs, idString) {
		docs = module.exports.indexByKey(docs, idString);
		return module.exports.values( docs );
	},
	
	getIds: function(docs, idString) {
		
		return module.exports.uniqueDocs(docs, idString).map(function(doc) {
			return idString ? doc[idString] : doc._id;			
		});
	},
	
	indexByKey: function(docs, key) {
		return docs
		.map(function(doc) {
			return doc[key || '_id'];
		})
		.reduce(function(result, id, index, list) {
			result[id] = result[id] || docs[list.indexOf(id)];
			return result;
		},{});
	},
	
	// remove docs in docs1 that are found in docs2
	filterByKey: function(docs1, docs2, key) {
		var docs2List = module.exports.indexByKey(docs2, key || '_id');
		return docs1.filter(function(doc) {
			
			return !docs2List[doc[key || '_id']];
		});
	},

	// What it does: returns true if all the members of k1 are present in k2
	compare: function (k1, k2, idString) {
		var first = {};
		var i;
		
		if (!!idString) {
			k1 = module.exports.getIds(k1, idString);
			k2 = module.exports.getIds(k2, idString);			
		}
		
		for (i = 0; i < k2.length; i += 1) {
			first[k2[i]] = true;
		}
		
		i = 0;
		while (i < k1.length && first[k1[i]]) { i += 1; }
		return (i == k1.length);				
	},

	// What it does: returns true k1 and k2 have the same members in same order
	identical: function (k1, k2) {
		var i;

		if (k1.length === k2.length) {
			for (i = 0; i < k1.length; i += 1) { 
				if (k1[i] !== k2[i]) {
					return false;
				} 
			}
			return true;				
		} 
		return false;
	},

	intersection: function(l1, l2) {
		var first = {};
		var i;
		for (i = 0; i < l1.length; i += 1) {
			first[l1[i]] = true;
		}
		
		first = l2.reduce(function(result, key) {
			if (!!first[key]) {
				result.push(key);
			}
			return result;
		}, []);	
		
		if (arguments.length > 2) {
			return module.exports.intersection.apply(null, [first].concat( Array.prototype.slice.call(arguments).slice(2)));
		}
		
		return first;
		
	},
	
	intersects: function(l1, l2) {
		return !!module.exports.intersection.apply(null, arguments).length;
	},

	keys: function(obj) {
		return Object.keys(obj);
	},
	
	extend: function() {
		return Array.prototype.slice.call(arguments).slice(0).reduce(function(result, val) {
			for (var k in val) {
				if (val.hasOwnProperty(k)) {
					result[k] = val[k];
				}
			}
			return result;
		}, arguments[0]);
	},

	// What it does: removes key/values from items whose value === undefined, then extends with objects
	// provided as arguments. Note: does not "clean" argument objects.
	clean: function(items, obj1, obj2, obj3) {
		var args = Array.prototype.slice.call(arguments);
		var keys = module.exports.keys(items);
		var pairs = keys.map(function(key) {
			return [key, items[key]];
		})
		.filter(function(pair) {
			return typeof pair[1] !== 'undefined';
		});

		items = pairs.reduce(function(target, pair) { 
			target[pair[0]] = pair[1];
			return target;
		}, {});
			Array.prototype.slice.call(arguments)
		return module.exports.extend.apply(null, [items].concat(args.slice(1)));
	},

	// returns an object without its prototype properties
	purify: function(obj) {
		var keys = Object.keys(obj);
		return module.exports.clean(keys.reduce(function(pure, key) {
			if (obj.hasOwnProperty(key)) {
				pure[key] = obj[key];
			}
			return pure;
		},{}));
	},
	
	objToLower: function(obj) {
		return module.exports.keys(obj).reduce(function(res, key) {
			res[key.toLowerCase()] = typeof obj[key] === 'string' ? obj[key].toLowerCase() : obj[key];
			return res;
		}, {});
	},
	
	// What it does: follows an object until it finds a matching property tag, 
	// then returns the value of it
	pfetch: function (o, p, visited) {
		var found
		, k;

		visited = visited || {};

		// if we've already been to this exact object, return undefined from this call
		if (visited.hasOwnProperty(o)) {
			return ;
		}
		
		if (o && p) {
			visited[p] = true;
		}

		if (o && typeof o==='object' && o.hasOwnProperty(p)) {
			return o[p];
		} 
		
		for (k in o) {
			if (o.hasOwnProperty(k)) {
				try {
					if (typeof o[k]==='object') {
						if (typeof found ==='undefined') {
							found = module.exports.pfetch.call(null, o[k], p, visited);
						}
					}
				} catch (e) {
					return ;
				}

			}
		}			
		return found;
	},


	// What it does: given a property, or list of propertis, return the value of the first hit
	// note 1: if o is an Array, delegate to 'find' which operates on Arrays
	fetch: function (o, p) {
		var i
		, keys = []
		, value;

		// convert p or list of p to Array for iteration
		if (Array.isArray(p)) {
			keys = p;
		} else {
			keys = Array.prototype.slice.call(arguments).slice(1);
		}

		if (o) {
			if (Array.isArray(o)) {
				return module.exports.intersection(o, p)[0];
			}
			
			i = 0;
			while (i < keys.length && !module.exports.pfetch(o, keys[i])) { i += 1; }
			if (i < keys.length) {
				return module.exports.pfetch(o, keys[i]);
			}
			return ;
		}
	},

	// What it does: takes item 'p1/p2/../pN' or 'p1.p2.p3' and searches for occurence of 
	// pN in pN-1
	hfetch: function (o, item) {
		var splitChar = (item.split('.').length) > (item.split('/').length) ? '.' : '/'
		, items = item.split(splitChar).filter(function(tag) { return !!tag; });

		return items.reduce(function(found, tag) {
			return found && found[tag];
		}, o);
	},
	
	coerce: function(expectedType, value) {
		var types = {
			'string': '',
			'number': 0,
			'array': [],
			'boolean': false
		};
		
		if (expectedType === 'date' && require('./core').isValidDate(value)) {
			return value;
		}
		
		if (expectedType === 'date' && !module.exports.isValidDate(value)) {
			return (value && new Date(value)) || new Date('1970-01-01');
		}
		
		if (expectedType && typeof value === 'undefined') {
			return types[expectedType];
		}
		if (expectedType && typeof value !== 'undefined') {
			if (expectedType === 'string') {
				return (value && value.toString()) || '';						
			}
			if (expectedType === 'number') {
				return isNaN( parseInt( value, 10 ) ) ? types.number : parseInt( value, 10 )
			}
			if (expectedType === 'array') {
				return Array.isArray(value) ? value : [ value ];
			}
			if (expectedType === 'boolean') {
				if (value === 'true') {
					return true;
				}
				if (value === 'false') {
					return false;
				}
				return typeof value === 'boolean' ? value : !!value;
			}
		}
		return value || '';
	}
	
};

