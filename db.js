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
    bookFilter
}