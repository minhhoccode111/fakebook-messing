# Some problems I faced

## mongodb-memory-server
on linux debian 12 we have to downgrade it to `9.1.6` because the newest force us to update to at least `mongodb >= 7` and break every tests

## about tests
in a test file, all describe handlers are executed _before_ any of the actual tests
if a test is failing, one of the first thing to check should be whether the test is failing when it's the only test that run

## about promises
For `async/await`, instead of using array methods (like `.reduce()`)
```js
const data = await array.reduce(async (accumP, current, index) => {
	const accum = await accumP;
	// do something
}, Promise.resolve([]));
```
It's would be better to just use plain loops
```js
const data = []
for (const item of array){
	const result = await somethingReturnPromise(item)
	// do something
}
```

## database error
when this error message occur 
``` 
"message": "Cast to ObjectId failed for value \"{\n  _id: undefined,\n  id: undefined,\n  name: undefined,\n  public: undefined,\n  avatarLink: undefined,\n  isCreator: true\n}\" (type Object) at path \"_id\" for model \"Group\""
```
normally because 
- I have a logic bug in database
- The esiest way is I have to manually clear it and re-populate
- But i have to find the logic I am missing and fix it before that

## database design
consideration about every single time we retrive a `User` we have to manually exclude `"-password -username"` 
- That's mean we should split it to 2 Models like `AuthUser` { username, password, user (point to `User`) } and `User` {fullname, bio, dateOfBirth, status, avatarLink, etc. }
- Then after a user successfully login, we will send a `token` encode their `User`'s id back to them so that from there we don't have to touch `AuthUser` again

