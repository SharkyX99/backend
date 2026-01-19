const db = require('../config/db');

async function updateSchema() {
    try {
        console.log("Checking columns in tbl_users...");
        const [columns] = await db.query("SHOW COLUMNS FROM tbl_users");

        const existingColumns = columns.map(col => col.Field);
        const columnsToAdd = [
            { name: "address", type: "TEXT" },
            { name: "sex", type: "VARCHAR(10)" },
            { name: "birthday", type: "DATE" }
        ];

        for (const col of columnsToAdd) {
            if (!existingColumns.includes(col.name)) {
                console.log(`Adding column '${col.name}'...`);
                await db.query(`ALTER TABLE tbl_users ADD COLUMN ${col.name} ${col.type}`);
            } else {
                console.log(`Column '${col.name}' already exists.`);
            }
        }

        console.log("Schema update complete.");
        process.exit(0);
    } catch (err) {
        console.error("Schema update failed:", err);
        process.exit(1);
    }
}

updateSchema();
