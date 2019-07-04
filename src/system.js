module.exports = {
	
	// Purpose: Compute the memory used by the application. Note: Works for Node.js
	memory: function() {

		if (console && console.memory && console.memory.usedJSHeapSize) {
			return console.memory.usedJSHeapSize/1024000;
		}
		if (typeof exports !== 'undefined') {
			return (require('util').inspect(process.memoryUsage().rss/1024000));
		};
	},
	
	// Purpose: execute a function afer a set time in seconds.
	wait: function (seconds, func, context) {
		var ms = seconds * 1000;	// converting to milli seconds
		var args = Array.prototype.slice.call(arguments).slice(3)
		setTimeout(function() {
			if (func && typeof func === 'function') {
				func.apply(context, args);
			}
		}, ms);
	}
};