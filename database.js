const sqlite3 = require('sqlite3').verbose();
const DB_FILE = './app_db.sqlite'; 

let db = new sqlite3.Database(DB_FILE, (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
        throw err;
    } else {
        console.log('Connected to the SQLite database.');
        const createUserTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            );
        `;
        db.run(createUserTable, (err) => {
            if (err) {
                console.error("Error creating user table: " + err.message);
            }
        });

        const createItemTable = `
            CREATE TABLE IF NOT EXISTS items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                category TEXT,
                quantity TEXT,
                expiry_date DATE NOT NULL,
                is_shareable BOOLEAN DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );
        `;
        db.run(createItemTable, (err) => {
             if (err) {
                console.error("Error creating item table: " + err.message);
            }
        });
    }
});

module.exports = db;