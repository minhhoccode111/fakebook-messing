# Messaging App Back

The **Messaging App Back** is created according to the assignment from **The Odin Project** [course](https://www.theodinproject.com/lessons/nodejs-messaging-app).
<br>
<br>

<!-- ## Screenshot

![Members Only Screenshot](/public/images/members-only-screenshot.png)

![Members Only Bcrypt Screenshot](/public/images/members-only-screenshot-password.png) -->

## **Demo** [here](https://messagingapptop.vercel.app/)

## **Document** [here](/notes.md)

## **Features**

- CRUD actions
- JSON Web Token Authentication
- CORS to only allow requests from my frontend
- RESTful API
<!-- - Using TDD, fully tested every cases -->

## **Outcome**

- Used **Express**
- Used **MongoDb Atlas**
- Used **express-validator**
- Used **luxon**
- Used **debug**
- Used **dotenv**
- Used **bcrypt**
- Used **passport-jwt**
- Used **jwt**
- Used **cors**
- Used **supertest**, **jest** and **mongodb-memory-server** to implement this API using TDD
- Used **Faker** to create extensive fake data
- and more

## **Idea to implement**

- Request queries to get limited messages every time (not all)
- Delete current logged in user
- Delete, edit message (vs group, vs person)
- Edit other users (like nickname)
- Block other users
- Friends

## **Getting Started**

HTTPS

```bash
git clone https://github.com/minhhoccode111/messaging-app-back.git
```

or SSH

```bash
git clone git@github.com:minhhoccode111/messaging-app-back.git
```

then

```bash
cd messaging-app-back
npm install
# start the server
npm start
# start the test
npm test
```

script to interact with mongodb databases

```bash
# clear database
node db-scripts/cleardb.js
# get info
node db-scripts/infodb.js
# populate db with fake data
node db-scripts/populatedb.js
# or provide your mongodb string as 3rd Command line argument
# node db-scripts/populatedb.js <some string here>
```

## **Navigation**

- See [all my projects'](https://github.com/minhhoccode111/all-projects-live-demos) live demos

- See my previous project [Where's Waldo Back](https://github.com/minhhoccode111/wheres-waldo-back)

- See this project's frontend [Messaging App Front](https://github.com/minhhoccode111/messaging-app-front)

<!-- * See my next project []() -->
