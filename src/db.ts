//-----------------------------
//#region Database Connection
//-----------------------------
import path from 'path';
import sqlite3 from 'sqlite3';
import { Request, Response } from 'express';
import { Customer, Trade, BookResult } from './types';

const sqlite = sqlite3.verbose();
// DB file lives at the project root; __dirname is src/ so go one level up
const dbFile = path.join(__dirname, '..', 'api-lab-example.db');
const db = new sqlite.Database(dbFile, (error) => {
    if (error) return console.error(error.message);
    console.log(`Connected to database ${dbFile}`);
});
//#endregion Database Connection

//-----------------------------
//#region User Handlers
//-----------------------------
const createUser = (req: Request, res: Response): void => {
    const query = `
    INSERT INTO customer(first_name, last_name, email)
    VALUES (?, ?, ?)
    `;
    db.run(
        query,
        [req.body.first_name, req.body.last_name, req.body.email],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(400).json({ error: err.message });
                return;
            }
            // apidoc says to not use callback style to load this.lastID
            // nalla figured this out! kudos to him!
            res.json({ id: this.lastID });
        }
    );
};

const getUser = (req: Request, res: Response): void => {
    const query = `
    SELECT * FROM customer WHERE customer_id = ?
    `;
    db.get(query, [req.params.id], (error: Error | null, result: Customer | undefined) => {
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
    });
};
//#endregion User Handlers

//-----------------------------
//#region Trade Handlers
//-----------------------------
// This is a trade function that creates a new trade in the database
// Between a lender user and a borrower user
const createTrade = (req: Request, res: Response): void => {
    // borrower (or lender) can be null
    const createdAt = new Date().toISOString();
    const query = `
    INSERT INTO trade(lender_id, borrower_id, book_id, status, created_at)
    VALUES (?, ?, ?, 'pending', ?)
    `;
    db.run(
        query,
        [req.body.lender_id, req.body.borrower_id, req.body.book_id, createdAt],
        function (err) {
            if (err) {
                console.error(err.message);
                res.status(400).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID });
        }
    );
};

const getUserTrades = (req: Request, res: Response): void => {
    const query = `
    SELECT * FROM trade WHERE lender_id = ? OR borrower_id = ?
    `;
    db.all(query, [req.params.id, req.params.id], (error: Error | null, result: Trade[]) => {
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
    });
};
//#endregion Trade Handlers

//-----------------------------
//#region Search Handlers
//-----------------------------
// could curry author and book and give the query and req body
const authorFilter = (req: Request, res: Response): void => {
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
    const author: string = req.body.author;
    const likeAuthor = '%' + author + '%';

    db.all(query, [likeAuthor], (error: Error | null, result: BookResult[]) => {
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
};

const bookFilter = (req: Request, res: Response): void => {
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
    const title: string = req.body.book;
    const likeTitle = '%' + title + '%';

    db.all(query, [likeTitle], (error: Error | null, result: BookResult[]) => {
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
};
//#endregion Search Handlers

export { authorFilter, bookFilter, createUser, getUser, createTrade, getUserTrades };
