# Fakebook Messing Back

## **Demo** [here](https://fakebook.vercel.app/)

## **Document** [here](docs/requirement.md)

## **Outcome**

- Learn **supertest**, **bun** and **mongodb-memory-server** to implement this API using TDD
- Learn **Rest.nvim** (replacement of **Postman**)
- Learn **Faker** to create extensive fake data
- Learn **escape-html** 
- and more

## **Idea to implement**

- Request queries to get limited post every time
- Edit post
- Delete, edit comment
- Block other users

## **Getting started**

Some scripts I created so that you can tweak the development database however you want

```bash
# clear database
node src/db-scripts/cleardb.js
# get info
node src/db-scripts/infodb.js
# populate db with fake data
node src/db-scripts/populatedb.js
# or provide your mongodb string as 3rd Command line argument
# node db-scripts/populatedb.js <some string here>
```

Start the project `back`
```bash
# cd /back
npm install 
npm run dev
```


<!-- * See my next project []() -->
