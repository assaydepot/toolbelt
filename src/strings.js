module.exports = {
	validateEmail: function(email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},
	
	hasNonAlphaNumeric: function (s) {
		return (s.replace(/[^a-z0-9]/gi, '|').split('|').length > 1);
	},
	
	// What it does: Filter out characters that resolve to 0;
	filterNoCharCode: function (s) {
		return Array.prototype.slice.call(s).reduce(function(str, c, i) {
			if (s.charCodeAt(i) !== 0) {
				str += c;
			}
			return str;
		},'');
	},

	filterNonAlphaNumeric: function (s, subs) {
		return module.exports.trim(s.replace(/[^a-z0-9]/gi, subs || ''));
	},
	
	// base64 chokes on charCodes > 255
	filterCharCodes: function(s) {
		// replace newlines and carriage returns with a space. then filter the non-ascii
		if (typeof s === 'string') {
			s = s.trim().replace(/[\n\r]/g, '');
		} else {
			s = '';
		}
		return Array.prototype.slice.call(s).reduce(function(result, x, i) {
			if (s.charCodeAt(i) < 256) {
				result += s[i];
			}
			return result;
		}, '');
	},
	
	numberWithCommas: function(x) {
		return (x || '0').toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	},
	
	flatten: require('./objects').flatten,
	
	// What this does: remove punctuation etc, parens, trim.
	sanitizeString: function(items) {
		if (!items) return '';
	
		var strToTest = Array.isArray(items) ? module.exports.flatten(items).join('|') : items;
		return strToTest
	
		// punctuation, asterisks, forward slash
		.replace(/[.,?'":;!]/g, '')
		.replace(/\*/g, '')
		.replace(/\//g, '')
	
		// hyphens
		.replace(/-/g, ' ')
	
		// parens and braces
		.replace(/[\[\]\(\)]/g, ' ')
	
		// extra white space
		.replace(/\s\s+/g, ' ')

		// trim the ends
		.trim()
	
		// all lower case
		.toLowerCase();
	},

	// remove multiple, leading or trailing spaces
	trim: function (s) {
		if (s) {
			s = s.replace(/[\n\r]/g," ");
			s = s.replace(/(^\s*)|(\s*$)/gi,"");
			s = s.replace(/[ ]{2,}/gi," ");
			return s;				
		}
	},
	
	// What it does: takes a string and returns the first character upperCased
	initialCaps: function (str) {
		return str.split(/_/g).map(function(s) {
			return s.charAt(0).toUpperCase() + s.slice(1);
		}).join(' ');
	},

	allCaps: function(key) {
		return module.exports.trim( (key || '').split(' ').map(function(tag) { 
			return module.exports.initialCaps(tag); }).join(' ') );
	},
	
	editDistance: function(s1, s2) {
		s1 = s1.toLowerCase();
		s2 = s2.toLowerCase();

		var costs = new Array();
		for (var i = 0; i <= s1.length; i++) {
			var lastValue = i;
			for (var j = 0; j <= s2.length; j++) {
				if (i == 0)
					costs[j] = j;
				else {
					if (j > 0) {
						var newValue = costs[j - 1];
						if (s1.charAt(i - 1) != s2.charAt(j - 1))
							newValue = Math.min(Math.min(newValue, lastValue),
								costs[j]) + 1;
						costs[j - 1] = lastValue;
						lastValue = newValue;
					}
				}
			}
			if (i > 0)
				costs[s2.length] = lastValue;
		}
		return costs[s2.length];
	},

	similarity: function(s1, s2) {
		var longer = s1;
		var shorter = s2;
		if (s1.length < s2.length) {
			longer = s2;
			shorter = s1;
		}
		var longerLength = longer.length;
		if (longerLength == 0) {
			return 1.0;
		}
		return (longerLength - module.exports.editDistance(longer, shorter)) / parseFloat(longerLength);
	}
};