module.exports = {
	
	isValidDate: function(d) {
	  return d instanceof Date && !isNaN(d);
	},
	flatten: function( items ) {
		if (Array.isArray(items)) {
			return items.reduce(function(result, item) {
				result = result.concat( module.exports.flatten( item ) );
				return result;
			}, []);
		}
		return [ items ];
	}
};