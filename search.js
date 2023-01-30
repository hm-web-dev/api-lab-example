// Contains extra search functionality before talking to the db 

const db = require("./db");

const authorFilter = (req, res) => {
    // for now just call db but also have some constraints like >3 letters 
    // technically this should be done frontend 
    if (req.body.author == undefined || req.body.author.length <= 3) {
        res.status(400).json({ error: "search query needs to be more than 3 letters" })
    } else {
        db.authorFilter(req, res)
    }
}

const bookFilter = (req, res) => {
    // for now just call db but also have some constraints like >3 letters 
    // technically this should be done frontend 
    if (req.body.book == undefined || req.body.book.length <= 3) {
        res.status(400).json({ error: "search query needs to be more than 3 letters" })
    } else {
        db.bookFilter(req, res)
    }
}

module.exports = {
    authorFilter,
    bookFilter,
}