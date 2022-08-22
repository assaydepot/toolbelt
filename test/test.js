var assert = require('assert');
var _ = require('../index');

describe('objects', function() {
	describe('#uniqueDocs(), #values()', function() {
		it('filter duplicate docs by _id or supplied key', function() {
			assert.equal(_.uniqueDocs([{_id: '1'}, {_id:'2'}, {_id:'1'}]).length, 2);
		});

		it('filter duplicate docs by "id" supplied key', function() {
			assert.equal(_.uniqueDocs([{id: '1'}, {id:'2'}, {id:'1'}], 'id').length, 2);
		});
	});

	describe('#getIds(), #identical()', function() {
		it('getIds', function() {
			assert.equal(_.identical(['1', '2'], _.getIds([{id: '1'}, {id:'2'}, {id:'1'}], 'id')), true);
		});
	});

	describe('#filterByKey(), #indexByKey()', function() {
		it('filterByKey', function() {
			var l1 = [{_id: '1'}, {_id:'2'}];
			var l2 = [{_id:'2'}];
			assert.equal( _.filterByKey(l1, l2).length, 1);
		});
	});

	describe('#compare()', function() {
		it('compare', function() {
			assert.equal( _.compare([1, 2], [3, 2, 1]), true);
		});

		it('compare objects', function() {
			assert.equal( _.compare([{id: '1'}, {id:'2'}], [{id: '1'}, {id:'2'}], 'id'), true);
		});
	});

	describe('#identical()', function() {
		it('identical', function() {
			assert.equal( _.identical([1, 2], [2, 1]), false);
		});
	});

	describe('#intersects(), #intersection()', function() {
		it('intersects', function() {
			assert.equal( _.intersects([1, 2], [5, 1]), true);
		});

		it('intersection', function() {
			assert.equal( _.intersection([1, 2, 5], [5, 2, 1], [2]).length, 1);
		});
	});

	describe('#flatten()', function() {
		it('flatten', function() {
			assert.equal( _.identical( _.flatten([[1, 2], [5, 1], [[5,6,7]]]), [1,2,5,1,5,6,7]), true );
		});
	});

	describe('#clean()', function() {
		it('clean with no arguments', function() {
			assert.equal( _.keys(_.clean({a: 1, b: undefined})).length, 1);
		});
	});

	describe('#clean()', function() {
		it('clean with arguments', function() {
			assert.equal( _.keys(_.clean({a: 1, b: undefined}, {b: 6, c: 7})).length, 3);
		});
	});

	describe('#purify()', function() {
		var Obj = function() { return this; };
		Obj.prototype.someKey = 5;
		var obj = new Obj();
		obj.key = 4;

		it('purify', function() {
			assert.equal( _.purify(obj).key, 4);
		});

		it('prototype value', function() {
			assert.equal( obj.someKey, 5 );
		});

		it('purify prototype property', function() {
			assert.equal( _.purify(obj).someKey, undefined);
		});
	});

	describe('#coerce()', function() {
		it('boolean null', function() {
			assert.equal( _.coerce('boolean', null), false);
		});

		it('boolean 1', function() {
			assert.equal( _.coerce('boolean', 1), true);
		});

		it('number 10', function() {
			assert.equal( _.coerce('number', 10), 10);
		});

		it('date 1988-09-09', function() {
			assert.equal( _.coerce('date', '1988-09-09 EDT').valueOf(), _.likeMoment( '1988-09-09' ).valueOf());
		});
	});

	describe('#objToLower()', function() {
		it('objToLower', function() {
			var obj = _.objToLower({
				KEY: 'Value'
			});

			assert.equal( obj.hasOwnProperty('key'), true);
			assert.equal( obj.hasOwnProperty('KEY'), false);
			assert.equal( obj.key, 'value');
		});
	});

	describe('#pfetch(), #fetch()', function() {
		var obj = {
			parent: { child: {brother: 2, sister: 3}}
		};

		it('pfetch', function() {
			assert.equal( _.pfetch(obj, 'brother'), 2)
		});

		it('fetch basic', function() {
			assert.equal( _.fetch(obj, 'brother'), 2)
		});

		it('fetch multiple arguments', function() {
			assert.equal( _.fetch(obj, 'blah', 'brother'), 2)
		});

		it('fetch array arguments', function() {
			assert.equal( _.fetch(obj, ['blah', 'brother']), 2)
		});

		it('hfetch brother', function() {
			assert.equal( _.hfetch(obj, 'parent.child.brother'), 2)
		});

		it('hfetch sister', function() {
			assert.equal( _.hfetch(obj, 'parent.child.sister'), 3)
		});
	});
});

describe('strings', function() {
	var badString = '6Â 918Â 417Â 712';

	it('#validateEmail() good', function() {
		assert.equal( _.validateEmail('ron@example.com'), true);
	});

	it('#validateEmail() expect bad', function() {
		assert.equal( _.validateEmail('ron_example.com'), false);
	});

	it('#hasNonAlphaNumeric() expect bad', function() {
		assert.equal( _.hasNonAlphaNumeric( badString ), true);
	});

	it('#filterNonAlphaNumeric()', function() {
		assert.equal( _.filterNonAlphaNumeric( badString, '-' ), '6--918--417--712');
	});

	it('#filterCharCodes()', function() {
		assert.equal( _.filterCharCodes( `${badstring}\n${badstring}\r`, `${badstring}${badstring}` )
	});

	it('#numberWithCommas()', function() {
		assert.equal( _.numberWithCommas( 200678 ), '200,678');
	});

	it('#sanitizeString()', function() {
		assert.equal( _.sanitizeString(' hello  *:. (something here) [more stuff]    \nits me\n\r'), 'hello something here more stuff its me');
	});

	it('#trim()', function() {
		assert.equal( _.trim(' hello      \nits me\n\r'), 'hello its me');
	});

	it('#initialCaps()', function() {
		assert.equal( _.initialCaps('hello its me'), 'Hello its me');
	});

	it('#allCaps()', function() {
		assert.equal( _.initialCaps('hello its me'), 'Hello its me');
	});

	it('#editDistance()', function() {
		assert.equal( _.editDistance('abc', 'aabddc'), 3);
	});

	it('#editDistance() reversed', function() {
		assert.equal( _.editDistance('aabddc', 'abc'), 3);
	});

	it('#similarity()', function() {
		assert.equal( _.similarity('abc', 'aabddc'), 0.5);
	});

	it('#similarity() reversed', function() {
		assert.equal( _.similarity('aabddc', 'abc'), 0.5);
	});
});

describe('dates', function() {

	describe('#likeMoment().valueOf()', function() {
		it('date 1988-09-09', function() {
			assert.equal( _.coerce('date', '1988-09-09 EDT').valueOf(), _.likeMoment( '1988-09-09' ).valueOf());
		});
	});

	describe('#likeMoment().isValid()', function() {
		it('date "blah"', function() {
			assert.equal( _.likeMoment('blah').isValid(), false);
		});

		it('date "1988-09-09"', function() {
			assert.equal( _.likeMoment('1988-09-09').isValid(), true);
		});

		it('date formatYear()', function() {
			assert.equal( _.likeMoment('1988-09-09').formatYear(), '1988');
		});

		it('date recentYears(5)', function() {
			assert.equal( _.likeMoment('1988-09-09').recentYears(5), '1983');
		});

		it('date recentYears("5")', function() {
			assert.equal( _.likeMoment('1988-09-09').recentYears('5'), '1983');
		});

		it('date subtract("5")', function() {
			assert.equal( _.likeMoment('1988-09-09').subtract(5, 'years').format(), '1983-09-11');
		});
	});
});
