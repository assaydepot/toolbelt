# toolbelt
Handy methods for manipulating objects, arrays, dates, and strings. I use this primarily to extend [Underscore](https://underscorejs.org), a library of JavaScript utility methods which I use for most projects.

## Collection functions Arrays or Objects
### uniqueDocs(docs, [idString])
Return a list of unique documents by applying the key value of `idString` provided to each document. If not provided the `idString` defaults to `_id`.
```
uniqueDocs([{_id:"1"}},{_id:"2"},{_id:"1"}])
// => [{_id:"1"}},{_id:"2"}]
```
### getIds(docs, [idString])
Return a list of unique document `ids`. The optional `idString` creates a list of unique values for any property common to all documents. The default value for `idString` is `_id`.
```
getIds([{id:"1"}},{id:"2"},{id:"1"}])
// => ["1", "2"]
```
### indexByKey(docs, [idString])
Returns an object hash keyed by the document values of `idString`. If not provided the `idString` defaults to `_id`.
```
indexByKey([{_id:"1"}},{_id:"2"},{_id:"1"}])
// => {1: {_id:"1"}, 2: {_id:"2"}]
```
### filterByKey(list1, list2, [idString])
Remove documents in `list1` that are also found in `list2` using the value of `idString` or `_id` if not provided.
```
filterByKey([{_id:"1"}},{_id:"2"}], [{_id:"1")])
// => [{_id:"2"}]
```
