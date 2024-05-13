# APIs design
## Auth
### `POST /auth/login`
Login, response with a `token` to create a login state (fake session) on the client
```js
return  res.json({
        token,
        expiresIn,
        expiresInDate,
        isLogin: true,
        self: userInfo,
        expiresInDateFormatted,
      })
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
return res.json({ self, followers, followings, mayknows, friends });
```

### `GET /users/:userid/connections`
Get all connections with `:userid`
```js
return res.json({ self, followers, followings, mayknows, friends });
```

`GET /feed`
Get all posts of all users that self is following
```js
return res.json(posts.sort((a, b) => b.createdAt - a.createdAt));
```

### `GET /users/:userid`
Get a user's info 
```js
return res.json(req.userParam);
```

### `PUT /users/:userid`
Update a user's info, return new info 
```js
return res.json(req.userParam);
```

### `POST /users/:userid/follows`
Follow a user, return all connections
```js
return res.json({ self, followers, followings, mayknows, friends });
```

### `GET /users/:userid/messages`
Get all messages with a user 
```js
res.json({
      messages,
      self: req.user,
      userParam: req.userParam,
    })
```

### `POST /users/:userid/messages`
Send new message to a user, return all messages (?)
```js
res.json({
      messages,
      self: req.user,
      userParam: req.userParam,
    })
```

### `GET /users/:userid/posts`
Get all posts of a user
```js
return res.json({ userParam: req.userParam, posts });
```

### `POST /users/:userid/posts`
Create a new post (self), return that post
```js
return res.json(post);
```

### `DELETE /users/:userid/posts/:postid`
Delete a post (self)
```js
return res.sendStatus(200);
```

### `GET /users/:userid/posts/:postid`
Get a post 
```js
return res.json({ ...post, likes, comments });
```

### `POST /users/:userid/posts/:postid/likes`
Like a post of a user, return that post
```js
return res.json({ ...post, likes, comments });
```

### `POST /users/:userid/posts/:postid/comments`
Comment on a post of a specific user, return that post
```js
return res.json({ ...post, likes, comments });
```

### `POST /users/:userid/posts/:postid/comments/:commentid/likes`
Like a comment on a post of a user, return that post
```js
return res.json({ ...post, likes, comments });
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

## Some invalid response
```js
return res.sendStatus(400) // invalid data
return res.sendStatus(403) // not allow
return res.sendStatus(404) // for both 401 and 403 and 404
return res.sendStatus(409) // conflict username or groupname
```
