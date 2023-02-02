# Bookstore API

My idea is to build a HM 'bookstore' where people can trade books within the community.
I remember an email chain trend where people would send books to each other and thought it'd be fun to build it for the school.

## Objectives

1. My project will require a light front-end where users can click around to peruse books ready to trade, and include images and such. I want to make a simple form for creating books to trade as well.  
2. For my backend I need to maintain a database have a starting list of books, then have a way for users to SEARCH books by author/title, to CREATE books they want to trade (with authentication), and marks trades as complete by an UPDATE endpoint.
3. I want to learn about authentication outside of class to only allow people with an account to create books to trade.
4. *STRETCH GOAL 1* If I have time, I want to create a small social media part of the app, where you can maybe set up book clubs with people with similar tastes and have read the same books :)
5. *STRETCH GOAL 2* If I have time, I want to create a recommendation engine for people looking for new books.
6. I considered making an Animal Crossing DB but there's not much front end possibilities with that, and I also couldn't find a ready-made database (only JSON and I think it was going to be too tedious to translate it to SQLite).

## Lab 3: Submission

Credit for original book database from <https://github.com/bbrumm/databasestar/tree/main/sample_databases/sample_db_gravity/mysql>

### SEARCH AUTHOR

`localhost:3999/search/author` (GET endpoint)
-- pass in "author" : "authorName" as a JSON body

### SEARCH BY TITLE

`localhost:3999/search/book` (GET endpoint)
-- pass in "title" : "bookTitle" as a JSON body

### CREATE USER TO TRADE

`localhost:3999/user/create` (POST endpoint)
-- example JSON body:

```JSON
{
    "first_name" : "xxx", 
    "last_name" : "xxx", 
    "email": "name@example.com"
}
```

**OTHER ENDPOINTS** (not made)
-- For all these customer-specific endpoints, plan is to have user automatically passed as authentication later

`localhost:3999/pastTrades/` (GET endpoint)
-- view past trades
`localhost:3999/trade/create` (POST endpoint)
-- pass in "title" : "bookTitle" as a JSON body
`localhost:3999/trade/:tradeid/claim` (PUT endpoint)
-- someone can claim a trade
`localhost:3999/trade/:tradeid/cancel` (PUT endpoint)
-- someone can cancel their trade
`localhost:3999/trade/:tradeid/deliver` (PUT endpoint)
-- someone can mark a trade as TRADED
