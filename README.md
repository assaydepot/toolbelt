# toolbelt
Handy methods for manipulating objects, arrays, dates, and strings. I use this primarily to extend [Underscore](https://underscorejs.org), a library of JavaScript utility methods which I use for most projects. 

For the most part, if the method I need is found in Underscore I use that. In some cases I re-wrote the Underscore method to my liking to avoid the dependency of this library on Underscore. 

Many of these functions can be found in other libraries, however it can be costly to import an entire library to get access to 1 or 2 functions. In those cases, I elected to write my own and include them here.

### Collections
#### uniqueDocs(docs [,idString])
Return a list of unique documents by applying the key value of `idString` provided to each document. If not provided the `idString` defaults to `_id`.
```
uniqueDocs([{_id:"1"}},{_id:"2"},{_id:"1"}]);
// => [{_id:"1"}},{_id:"2"}]
```
#### getIds(docs [,idString])
Return a list of unique document `ids`. The optional `idString` creates a list of unique values for any property common to all documents. The default value for `idString` is `_id`.
```
getIds([{id:"1"}},{id:"2"},{id:"1"}]);
// => ["1", "2"]
```
#### indexByKey(docs [,idString])
Returns an object hash keyed by the document values of `idString`. If not provided the `idString` defaults to `_id`. Use this to create lookup tables for any document property.

Note: if the `idString` property is not unique, only the first document containing the property will be indexed.
```
indexByKey([{_id:"1"}},{_id:"2"},{_id:"1"}]);
// => {1: {_id:"1"}, 2: {_id:"2"}]
```
#### filterByKey(docs1, docs2 [,idString])
Remove documents in `list1` that are also found in `list2` using the value of `idString` or `_id` if not provided.

Use this when you have a manifest list of documents to process (docs1) and a list of already processed docs (docs2).
```
filterByKey([{_id:"1"}},{_id:"2"}], [{_id:"1")]);
// => [{_id:"2"}]
```
#### compare(list1, list2 [,idString])
Returns true if all the members of array `list1` are present in array `list2`. If `idString` provided then list1 and list2 must be arrays of `objects` with `idString` properties for each index of the array.
```
compare([1, 2, 3],[3, 2, 1, 4]);
// => true
compare([1, 2], [2, 3]);
// => false
compare([{id:"1"}},{id:"2"}], [{id:"2"}},{id:"1"}], 'id');
// => true
```
#### identical(list1, list2)
Returns true if both arrays have same elements in the same order.
```
identical([1, 2], [2, 1]);
// => false
```
#### intersection(list1, ...list2)
Returns all items in `list1` also found in `list2` to `listN`.
```
intersection([1, 2, 3], [2, 1], [1, 2]);
// => [2, 1]
```
#### intersects(list1, ...list2)
Returns true if all items in `list1` also found in `list2` to `listN1.
```
intersects([1, 2, 3], [2, 1], [1, 2]);
// => [2, 1]
```
#### extend(destination, ...obj1)
Works just like `_.extend` does shallow copy of all properties in objects to the destination object. Any nested objects or arrays will be copied by reference, not duplicated. It's in-order, so the last source will override properties of the same name in previous arguments.
```
extend({a: 5}, {b:6});
// => {a:5, b:6}
```
#### clean(obj [, ...obj1])
Removes key/values from obj whose value === undefined, then extends the object with objects provided as arguments. 
```
clean({a: 5, b: undefined});
// => {a: 5}
```
#### purify(obj)
Returns `obj` without its prototype properties.
```
var SomeObject = function() { return this; };
SomeObject.prototype.someKey = 5;
var someObject = new SomeObject();
someObject.myKey = 6;
console.log(someObject.someKey, someObject.myKey);
// => 5, 6
someObject = purify(someObject);
console.log(someObject.someKey, someObject.myKey);
// => undefined, 6
```
#### objToLower(obj)
Makes a copy of `obj` and lower cases all keys and values. Usefull when maninpulating data from unknown sources.
```
objToLower({Key: 'Some Value'});
// => {key: 'some value'}
```
#### coerce(baseType, value)
Force a value to a known type. `baseType` is one of *number, string, array, or boolean*. Usefule when dealing with URL string parameters where values for true and false are always truthy strings `'true'` and `'false'`.
```
coerce('number', '5');
// => 5
coerce('string', 5);
// => '5'
coerce('boolean', 'true');
// => true
coerce('string', true);
// => 'true'
```
#### pfetch(obj, property)
Searches an object for the first value of `property` and returns it.
```
var obj = {family:{children:{brother: 3, sister: 2}}}
pfetch(obj, 'brother');
// => 3
pfetch(obj, 'children');
// => {brother: 3, sister: 2}
pfetch(obj, 'something');
// => undefined
```
#### fetch(obj, ...props)
Like `pfetch` but property to search is the an array argument, or multiple arguments to the function.
```
var obj = {family:{children:{brother: 3, sister: 2}}}
fetch(obj, 'mother', 'brother');
// => 3
fetch(obj, ['children', 'sister']);
// => {brother: 3, sister: 2}
```
#### hfetch(obj, 'select.string')
Return a hierarchical property value based on the `select.string`. Usefull when testing existence of a value for a property.

Note: Period '.' or forward slash '/' characters are valid separators.
```
var obj = {family:{children:{brother: 3, sister: 2}}}
hfetch(obj, 'family.children.brother');
// => 3
hfetch(obj, 'family/children/sister');
// => 2
hfetch(obj, 'family.mother');
// => undefined
```
### String Utilities
Utilities for cleaning strings and calculating similarity.

#### validateEmail( email )
Returns `true` if email appears to be a valid email.
```
validateEmail('ron@example.com')
// => true
validateEmail('@example.com')
// => false
```
#### hasNonAlphaNumeric( str )
Returns true if any characters in string are not alphas or numbers.
```
hasNonAlphaNumeric('no!');
// => true
hasNonAlphaNumeric('yes');
// => false
```
#### filterNonAlphaNumeric( str [,subs] )
Replaces non-alphanumeric characters with an optional substitute string.
```
filterNonAlphaNumeric('no!', '-');
// => 'no-'
```
#### filterNoCharCode( str )
Removes characters with ascii codes that resolve to 0 embedded in the string.

#### filterCharCodes( str )
Trims the string and removes ascii codes > 255 embedded in the string.

#### numberWithCommas( n )
Formats a number or numeric string.
```
numberWithCommas( '123456' )
// => '123,456'
```
#### sanitizeString( str )
Trims a string, remove newlines, carriage returns, embedded parens and braces, punctuation, asterisks from a string.
#### trim( str )
Removes leading and trailing white space, newlines and carriage returns, and extra embedded white space.
```
trim('this   is a\nstring .  ');
// => 'this is a string'
```
#### initialCaps( str )
Capitalizes the first character of a string.
```
initialCapse('welcome home');
// => 'Welcome home
```
#### allCaps( str )
Capitalizes the first character of each word in a string.
```
allCaps('welcome home');
// => 'Welcome Home'
```
#### editDistance(str1, str2)
Returns an integer by calculating the number of changes needed to turn str1 into str2.
```
editDistance(abc', 'aabddc');
// => 3
```
#### similarity(str1, str2)
Returns a fraction between 0 and 1 to using the editDistance as a percentage of the longer string.
```
similarity( 'abc', 'aabddc');
// => 0.5
```
### Date Helper: likeMoment( [date [,timeZone]] )
Create a date manipulation object.

Supply `date` as a number, string, or Date() object. If no `date` is provided the object will take on today's date.

If you do not supply an optional `timeZone` the object will take on the time zone of the local machine where executing. You can over-ride the time zone by including it in the `date` specification by supplying a string, i.e., '2019-07-04 EDT'. Otherwise provide the `timeZone` to over-ride the default local machine time zone.

> [Moment](https://momentjs.com/) provides a powerful and universal date manipulation library. For many projects Moment increases the size of your code quite a bit. Since for many data science projects I standardize on 'YYYY-MM-DD' format for dates I need only a few light-weight methods to calculate and format dates. 

> Note: Unless otherwise specified, all date values are based on time zone of local machine.
#### Methods
##### valueOf()
Just like `new Date().valueOf()`

##### isValid()
Returns `true` if the object is manipulating a valid date.

##### formatYear()
Returns 4-digit 'YYYY' value.

##### recentYears(num)
Returns current year minus `num`. String or numeric argument is supported.

##### format( fmt )
Defaults to 'YYYY-MM-DD' if no `fmt` provided. Allows `MMM DD YYYY` also.

##### subtract(num, period)
Calculates a new date value based on the supplied `num` and the `period` which can be one of: 'year', 'month', 'week', 'day', 'years', 'months', 'weeks', 'days' and modifies the value of the current object.

##### diff(dateStr, period)
Calculates the integer difference in milliseconds between `dateStr` and the value of the current object.

##### today()
Returns `true` if the value of the current object equals todays' date.

```
var myDate = likeMoment( '2019-07-04' );
myDate.today();
// => false
likeMoment( '2019-07-05' ).today();
// => true
likeMoment( '2019-07-05' ).valueOf();
// => 1562299200000
likeMoment( '2019-07-05' ).formatYear();
// => '2019'
likeMoment().recentYear(4);
// => '2015'
likeMoment().format('MMM DD YYYY');
// => 'Jul 05, 2019'
likeMoment().subtract(1, 'year').format();
// => '2018-07-05'
likeMoment( '2019-07-05').subtract(1, 'day').format();
// => '2019-07-04'
likeMoment( '2019-07-05').subtract(1, 'day').format('MMM DD YYYY');
// => 'Jul 04, 2019
likeMoment( '2019-07-05').diff('2019-07-03', 'day');
// => 2
likeMoment( '2019-07-05').today();
// => true
```

