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


// Handle CORS w/ client
// For more information about CORS (Cross-Origin Resource Sharing):
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
app.use((req, res, next) => {
  // Allow access from multiple origins
  const allowedOrigins = [
    "http://localhost:5174",
    "https://www.figma.com"
  ];
  const origin = req.headers.origin;
  console.log("origin is " + origin);
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  // Allow specific requests
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Pass to next layer of middleware
  next();
});
//-----------------------------
//#region Database Routes
//-----------------------------

app.get('/', (req, res)=> res.send({"welcome": "it works"}))
/* CRUD DB Routes */ 

// CREATE USER
app.post('/user/create', db.createUser)

// GET USER 
app.get('/user/:id', db.getUser)

// FILTER BY Author 
app.get('/search/author', search.authorFilter)

// FILTER BY Book 
app.get('/search/book', search.bookFilter)

// CUSTOMER-SPECIFIC ENDPOINTS
// PAST ORDERS 
app.get('/user/:id/trades', db.getUserTrades)

// CREATE TRADE // given a json object of an array of books.  
app.post('/trade/create', db.createTrade)

// LOGIN (if I implement authentication)



//#endregion Database Routes


//-----------------------------
//#region Server
//-----------------------------
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
  //#endregion Server