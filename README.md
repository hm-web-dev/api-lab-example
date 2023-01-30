# Bookstore API
My idea is to build a HM 'bookstore' where people can trade books within the community.
I remember an email chain trend where people would send books to each other and thought it'd be fun to build it for the school.

## Objectives

1. My project will require a light front-end where users can click around to peruse books ready to trade, and include images and such. I want to make a simple form for creating books to trade as well.  
2. For my backend I need to maintain a database have a starting list of books, then have a way for users to SEARCH books by author/title, to CREATE books they want to trade (with authentication), and marks trades as complete by an UPDATE endpoint.
3. I want to learn about authentication outside of class and it woul be .
4. *STRETCH GOAL 1* If I have time, I want to create a small social media part of the app, where you can maybe set up book clubs with people with similar tastes and have read the same books :)
5. *STRETCH GOAL 2* If I have time, I want to create a recommendation engine for people looking for new books. 

## Lab 3: Submission 

**SEARCH AUTHOR**
localhost:3999/search/author (get endpoint)
-- pass in "author" : "authorName" as a JSON body

**SEARCH BY TITLE**
localhost:3999/search/book (get endpoint)
-- pass in "title" : "bookTitle" as a JSON body

**CREATE BOOK TO TRADE**
localhost:3999/create/trade (post endpoint)
-- pass in "title" : "bookTitle" as a JSON body
-- plan is to have user automatically passed as authentication 

