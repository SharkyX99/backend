const pool = require('./config/db');

(async () => {
    try {
        console.log('Testing database connection...');
        const [rows] = await pool.query('SELECT NOW() AS now');
        console.log('DB OK:', rows[0]);
        process.exit(0);
    } catch (e) {
        console.log('DB Error:', e.code, e.message);
        process.exit(1);
    }
})();
