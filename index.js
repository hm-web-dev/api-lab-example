//-----------------------------
// #region Setup
//-----------------------------
const express = require("express");
const bcrypt = require('bcrypt');
const app = express();
const db = require("./db");
const search = require("./search");
const PORT = 3999;
//#endregion Setup

//-----------------------------
//#region App Config
//-----------------------------
// https://stackoverflow.com/questions/23259168/what-are-express-json-and-express-urlencoded
// Middleware that parses POST / PUT requests from a client
app.use(express.json());


//-----------------------------
//#region Database Routes
//-----------------------------

app.get('/', (req, res)=> res.send({"welcome": "it works"}))
/* CRUD DB Routes */ 

// PAST ORDERS 

// LOGIN (if I learn authentication)

// CREATE TRADE // given a json object of an array of books.  

// CREATE USER
app.post('/user/create', db.createUser)

// FILTER BY Author 
app.get('/search/author', search.authorFilter)

// FILTER BY Book 
app.get('/search/book', search.bookFilter)




//#endregion Database Routes


//-----------------------------
//#region Server
//-----------------------------
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
  //#endregion Server