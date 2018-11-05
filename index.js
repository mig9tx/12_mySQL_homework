require('dotenv').config();
const mysql = require('mysql');
// console.log(process.env);

const connection = mysql.createConnection({
    host: process.env.DBHOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_DATABASE || 'ice_creamDB',
});

connection.connect((err) => {
    if(err) throw(err);
    console.log(`connected as id ${connection.threadId}`);

    connection.query('SELECT * FROM products' (err, res)) => {
        if(err) throw (err);
        console.log(res);
    })
});