# APIs design
## Auth
### `POST /auth/login`
Login, response with a `token` to create a login state (fake session) on the client
```js
return res.status(200).json({
token,
self: userInfo,
expiresIn,
expiresInDate,
expiresInDateFormatted,
});
```

### `POST /auth/signup`
Create a new account 
```js
return res.sendStatus(200);
```

## Users
### `GET /users`
Get all connections with self (`req.user`)
```js
return res.json({ self, followers, followings, mayknows });
```

### `GET /users/:userid`
Get a user's info 
```js
return res.json(req.userParam);
```

### `PUT /users/:userid`
Update a user's info, then response with new user's info
```js
return res.json(user);
```

### `GET /users/:userid/connections`
Get all connections with self (`:userid`)
```js
return res.json({ self, followers, followings, mayknows });
```

### `POST /users/:userid/follows`
Follow a user, then response with all user connections
```js
return res.json({ self, followers, followings, mayknows });
```

### `GET /users/:userid/messages`
Get all messages with a user 
```js
res.json({
self: req.user,
userParam: req.userParam,
messages,
})
```

### `POST /users/:userid/messages`
Send new message to a user, response all messages
```js
res.json({
self: req.user,
userParam: req.userParam,
messages,
})
```

### `GET /users/:userid/posts`
Get all posts of a user
```js
return res.json({ userParam: req.userParam, posts });
```

### `POST /users/:userid/posts`
Create a new post (self), response all posts
```js
return res.json({ userParam: req.userParam, posts });
```

### `DELETE /users/:userid/posts/:postid`
Delete a post (self), response all posts
```js
return res.json({ userParam: req.userParam, posts });
```

### `POST /users/:userid/posts/:postid/likes`
Like a post of a user, response all interactions with that post
```js
return res.json({ ...post.toJSON(), likes, comments });
```

### `POST /users/:userid/posts/:postid/comments`
Comment on a post of a specific user, response all interactions with that post
```js
return res.json({ ...post.toJSON(), likes, comments });
```

### `POST /users/:userid/posts/:postid/comments/:commentid/likes`
Like a comment on a post of a user, response all interactions with that post
```js
return res.json({ ...post.toJSON(), likes, comments });
```

## Groups
### `GET /groups`
Get all existed groups
```js
res.json({
self: req.user,
joinedGroups,
publicGroups,
privateGroups,
})
```

### `POST /groups`
Create a new group, response all exited groups
```js
res.json({
self: req.user,
joinedGroups,
publicGroups,
privateGroups,
})
```

### `GET /groups/:groupid`
Get a group info
```js
return res.json(req.groupParam);
```

### `PUT /groups/:groupid`
Update a group info, response all exited groups
```js
res.json({
self: req.user,
joinedGroups,
publicGroups,
privateGroups,
})
```

### `DELETE /groups/:groupid`
Delete a group (messages, members, etc.), response all existed groups
```js
res.json({
self: req.user,
joinedGroups,
publicGroups,
privateGroups,
})
```

### `GET /groups/:groupid/messages`
Get all messages in a group
```js
res.json({
isMember,
messages,
})
```

### `POST /groups/:groupid/messages`
Send a message to a group, response all messages in that group
```js
res.json({
isMember,
messages,
})
```

### `GET /groups/:groupid/members`
Get all members of a group
```js
res.json({ self: req.user, groupMembers });
```

### `POST /groups/:groupid/members`
A member join group, response all members of that group
```js
res.json({ self: req.user, groupMembers });
```

### `DELETE /groups/:groupid/members/:memberid`
A member leave group (or get kicked), response all member of that group
```js
res.json({ self: req.user, groupMembers });
```
