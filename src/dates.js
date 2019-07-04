// NOTE: requires dateStr form: 'YYYY-MM-DD'
var timeZone = new Date().toLocaleTimeString('en-us', {
	timeZoneName:'short'
}).split(' ')[2] || 'EDT';

module.exports = {
	isValidDate: require('./core').isValidDate,
	likeMoment: function( dateStr ) {
		var milliseconds = {
			day: (24 * 60 * 60 * 1000),
			days: (24 * 60 * 60 * 1000),
			week: (7 * 24 * 60 * 60 * 1000),
			weeks: (7 * 24 * 60 * 60 * 1000),
			month: (31 * 24 * 60 * 60 * 1000),
			months: (31 * 24 * 60 * 60 * 1000),
			year: (365 * 24 * 60 *60 * 1000),
			years: (365 * 24 * 60 *60 * 1000)
		};
		var checkPeriod = function(period) {
			if (!milliseconds[period]) {
				console.log('[base-utils/likeMmoment] warning: unrecognized period, using "month" - ', period);
				return 'month';
			}
			return period;
		}
		var months = ['01', '02','03','04','05','06','07','08','09','10','11', '12'];
		var monthsStr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
		var days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
			17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32].map(function(num) {
			if (num > 9) return ''+num;
			return '0'+num;
		});
		var theDate;
		
		if (typeof dateStr === 'number') {
			dateStr = new Date( dateStr );
			dateStr = [dateStr.getUTCFullYear(), months[dateStr.getUTCMonth()], days[dateStr.getUTCDate()-1]].join('-')
			theDate = new Date( dateStr + ' ' + timeZone );
		} else if (typeof dateStr === 'string') {
			theDate = new Date( dateStr + ' ' + timeZone );
		} else if (dateStr instanceof Date) {
			theDate = dateStr;			
		} else {
			theDate = new Date();			
		}
			
		var that = {
			valueOf: function() {
				return theDate.valueOf();
			},
			isValid: function() {
				return theDate.toString() !== 'Invalid Date';
			},
			formatYear: function() {
				return theDate.getFullYear().toString();
			},
			recentYears: function(period) {
				return (theDate.getFullYear() - period).toString();
			},
			format: function( formatStr ) {
				
				// we handle: 'YYYY-MM-DD' or 'MMM DD, YYYY'
				if ((formatStr || '').indexOf('MMM') === 0) {
					return [ monthsStr[theDate.getUTCMonth()], ' ', days[theDate.getUTCDate()-1], ', ', theDate.getUTCFullYear() ].join('');
				}			
				return [theDate.getUTCFullYear(), months[theDate.getUTCMonth()], days[theDate.getUTCDate()-1]].join('-')
			},
			subtract: function(num, period) {
				var minus = (milliseconds[checkPeriod(period)]) * num;
			
				theDate = new Date( theDate.valueOf() - minus );
				return this;
			},
			
			diff: function( dateStr, period) {
				var second = exports.likeMoment( dateStr ).valueOf();
				var difference = this.valueOf() - second;
				
				return Math.round( (difference/(milliseconds[checkPeriod(period)]) ) * 100 ) / 100
			},
			today: function() {
				var otherDay = exports.likeMoment().format().split('-')[2];
				var today = this.format().split('-')[2];
				
				return today === otherDay;
			}
		}
		return that;
	}
};