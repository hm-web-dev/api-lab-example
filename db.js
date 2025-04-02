//-----------------------------
//#region Database Connection
//-----------------------------
const path = require("path");
const sqlite = require("sqlite3").verbose();
const dbFile = path.join(__dirname, "api-lab-example.db");
const db = new sqlite.Database(dbFile, (error) => {
    if (error) return console.error(error.message);
    console.log(`Connected to database ${dbFile}`);
});

const createUser = (req, res) => {
    const query =
        `
    INSERT INTO customer(first_name, last_name, email) 
    VALUES (?, ?, ?)
    `
    db.run(query, [
        req.body.first_name, req.body.last_name, req.body.email
    ],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(400).json({ error: err.message });
                return;
            }
            else {
                // apidoc says to not use callback style to load this.lastID
                // nalla figured this out! kudos to him!  
                res.json({ id: this.lastID });
            }
        }
    )
}

// This is a trade function that creates a new trade in the database
// Between a lender user and a borrower user
const createTrade = (req, res) => { 
    // borrower (or lender) can be null
    const createdAt = new Date().toISOString();
    
    const query =
        `
    INSERT INTO trade(lender_id, borrower_id, book_id, status, created_at)
    VALUES (?, ?, ?, 'pending', ?)
    `
    db.run(query, [
        req.body.lender_id, req.body.borrower_id, req.body.book_id, createdAt
    ],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(400).json({ error: err.message });
                return;
            }
            else {
                res.json({ id: this.lastID });
            }
        }
    )
}

const getUser = (req, res) => {
    const query = `
    SELECT * FROM customer WHERE customer_id = ?
    `
    db.get(query, [req.params.id], (error, result) => {
        if (error) {
            console.error(error.message);
            res.status(400).json({ error: error.message });
            return;
        }
        if (result) {
            res.json(result);
        } else {
            // If nothing is returned, there is no id
            res.sendStatus(404);
        }
    })
}

const getUserTrades = (req, res) => {  
    const query = `
    SELECT * FROM trade WHERE lender_id = ? OR borrower_id = ?
    `
    db.all(query, [req.params.id, req.params.id], (error, result) => {
        if (error) {
            console.error(error.message);
            res.status(400).json({ error: error.message });
            return;
        }
        if (result) {
            res.json(result);
        } else {
            // If nothing is returned, there is no id
            res.sendStatus(404);
        }
    })
}

// could curry author and book and give the query and req body
const authorFilter = (req, res) => {
    const query = `
    SELECT title, author_name, ba.book_id, a.author_id
        FROM 
        book 
        INNER JOIN book_author ba 
        ON book.book_id = ba.book_id 
        INNER JOIN author  a
        ON ba.author_id = a.author_id
        WHERE author_name LIKE ?;
    `;
    const author = req.body.author;
    const likeAuthor = '%' + author + '%';

    db.all(query, [likeAuthor], (error, result) => {
        if (error) {
            console.error(error.message);
            res.status(400).json({ error: error.message });
            return;
        }
        // If nothing is returned, then result will be undefined
        if (result) {
            res.json(result);
        } else {
            res.sendStatus(404);
        }
    });
}

const bookFilter = (req, res) => {
    const query = `
    SELECT title, author_name, ba.book_id, a.author_id
        FROM 
        book 
        INNER JOIN book_author ba 
        ON book.book_id = ba.book_id 
        INNER JOIN author  a
        ON ba.author_id = a.author_id
        WHERE book.title LIKE ?;
    `;
    const title = req.body.book;
    const likeTitle = '%' + title + '%';

    db.all(query, [likeTitle], (error, result) => {
        if (error) {
            console.error(error.message);
            res.status(400).json({ error: error.message });
            return;
        }
        // If nothing is returned, then result will be undefined
        if (result) {
            res.json(result);
        } else {
            res.sendStatus(404);
        }
    });
}

module.exports = {
    authorFilter,
    bookFilter,
    createUser,
    getUser,
    createTrade,
    getUserTrades,
}