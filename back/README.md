# Fakebook Messing Back

## **Demo** [here](https://fakebookmessing.vercel.app/)

## **Document** [here](docs/requirement.md)

## **Outcome**

- Used **supertest**, **bun** and **mongodb-memory-server** to implement this API using TDD
- Used **Faker** to create extensive fake data
- Used **escape-html** 
- Learn **Rest.nvim** (replacement of **Postman**)
- and more

## **Idea to implement**

- Request queries to get limited post every time
- Edit post
- Delete, edit comment
- Block other users

## **Getting started**

Some scripts I created so that you can tweak the development database however you want

```bash
node src/db-scripts/cleardb.js # clear
node src/db-scripts/infodb.js # info
node src/db-scripts/populatedb.js # populate

# call the script with another db string
# node db-scripts/populatedb.js <some string here> 
```

Start the project `back`
```bash
# cd /back
npm install 
npm run dev
```


<!-- * See my next project []() -->
