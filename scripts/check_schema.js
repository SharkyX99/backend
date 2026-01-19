const db = require('../config/db');
const fs = require('fs');
const path = require('path');

async function checkSchema() {
    const logPath = path.join(__dirname, 'schema_check.log');
    try {
        const [columns] = await db.query("SHOW COLUMNS FROM tbl_users");
        const columnNames = columns.map(c => c.Field).join(', ');
        fs.writeFileSync(logPath, `Columns in tbl_users: ${columnNames}\nDB_NAME: ${process.env.DB_NAME}`);
        console.log("Check complete.");
        process.exit(0);
    } catch (err) {
        fs.writeFileSync(logPath, `Error: ${err.message}`);
        console.error(err);
        process.exit(1);
    }
}

checkSchema();
