const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const logFile = path.join(__dirname, 'force_update.log');

function log(msg) {
    fs.appendFileSync(logFile, `[${new Date().toISOString()}] ${msg}\n`);
    console.log(msg);
}

async function run() {
    log('Starting force update...');
    log(`Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT} User: ${process.env.DB_USER} DB: ${process.env.DB_NAME}`);

    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_NAME
        });
        log('Connected!');

        const columnsToAdd = [
            { name: "address", type: "TEXT" },
            { name: "sex", type: "VARCHAR(10)" },
            { name: "birthday", type: "DATE" }
        ];

        for (const col of columnsToAdd) {
            log(`Checking column: ${col.name}`);
            try {
                await connection.query(`SELECT ${col.name} FROM tbl_users LIMIT 1`);
                log(`Column ${col.name} exists.`);
            } catch (err) {
                log(`Column ${col.name} missing. Adding...`);
                await connection.query(`ALTER TABLE tbl_users ADD COLUMN ${col.name} ${col.type}`);
                log(`Added ${col.name}.`);
            }
        }

        log('Update complete.');
        await connection.end();
        process.exit(0);
    } catch (err) {
        log(`FATAL ERROR: ${err.message}`);
        process.exit(1);
    }
}

run();
