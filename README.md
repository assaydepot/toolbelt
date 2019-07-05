# toolbelt
Handy methods for manipulating objects, arrays, dates, and strings. I use this primarily to extend [Underscore](https://underscorejs.org), a library of JavaScript utility methods which I use for most projects. For the most part, if the method I need is found in Underscore I use that. In some cases I re-wrote the Underscore method to my liking to avoid the dependency of this library on Underscore. Many of these functions can be found in other libraries, however it can be costly to import an entire library to get access to 1 or 2 functions. In those cases, I elected to write my own and include them here.

### Collection functions Arrays or Objects
#### uniqueDocs(docs, [idString])
Return a list of unique documents by applying the key value of `idString` provided to each document. If not provided the `idString` defaults to `_id`.
```
uniqueDocs([{_id:"1"}},{_id:"2"},{_id:"1"}]);
// => [{_id:"1"}},{_id:"2"}]
```
#### getIds(docs, [idString])
Return a list of unique document `ids`. The optional `idString` creates a list of unique values for any property common to all documents. The default value for `idString` is `_id`.
```
getIds([{id:"1"}},{id:"2"},{id:"1"}]);
// => ["1", "2"]
```
#### indexByKey(docs, [idString])
Returns an object hash keyed by the document values of `idString`. If not provided the `idString` defaults to `_id`.
```
indexByKey([{_id:"1"}},{_id:"2"},{_id:"1"}]);
// => {1: {_id:"1"}, 2: {_id:"2"}]
```
#### filterByKey(docs1, docs2, [idString])
Remove documents in `list1` that are also found in `list2` using the value of `idString` or `_id` if not provided.
```
filterByKey([{_id:"1"}},{_id:"2"}], [{_id:"1")]);
// => [{_id:"2"}]
```
#### compare(list1, list2, [idString])
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
identical([1, 2], [1, 2, 3]);
// => false
```
#### intersection(list1, list2, listN)
Returns all items in `list1` also found in `list2` to `listN1.
```
intersection([1, 2, 3], [2, 1], [1, 2]);
// => [2, 1]
```
#### intersects(list1, list2, listN)
Returns true if all items in `list1` also found in `list2` to `listN1.
```
intersects([1, 2, 3], [2, 1], [1, 2]);
// => [2, 1]
```
#### extend(destination, obj1, objN)
Works just like `_.extend` does shallow copy of all properties in objects to the destination object. Any nested objects or arrays will be copied by reference, not duplicated. It's in-order, so the last source will override properties of the same name in previous arguments.
```
extend({a: 5}, {b:6});
// => {a:5, b:6}
```
#### clean(obj [, obj1, objN])
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
#### fetch(obj, propertyList)
Like `pfetch` but property to search is the an array argument of multiple arguments to the function.
```
var obj = {family:{children:{brother: 3, sister: 2}}}
fetch(obj, 'mother', 'brother');
// => 3
fetch(obj, ['children', 'sister']);
// => {brother: 3, sister: 2}
```
#### hfetch(obj, 'select.string')
Return a hierarchical property value based on the select.string. Usefull when testing existence of a value for a property
```
var obj = {family:{children:{brother: 3, sister: 2}}}
hfetch(obj, 'family.children.brother');
// => 3
hfetch(obj, 'family.children.sister');
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

