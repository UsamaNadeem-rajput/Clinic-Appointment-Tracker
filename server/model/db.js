const mysql = require ("mysql2/promise");


const db = mysql.createPool({
    host : "localhost",
    user: "root",
    password: "",
    database:"smart-clinic-system",
    dateStrings: true
});



module.exports = db;