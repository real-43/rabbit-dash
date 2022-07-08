
const connection = require('../config/dbConfig');
const { Pool, Client } = require('pg');



const pool = new Pool(connection.testDBuser);

const query = async (sql) => {
    try {
        const result = await pool.query(sql)
        pool.end()
        return result.rows
    } catch (err) {
        console.log("query err", err)
        return false;
    }
}

const update = async (sql) => {
    try {
        const result = await pool.query(sql)
        pool.end()
        return true
    } catch (err) {
        console.log("query err", err)
        return false;
    }
}

module.exports = { query, update };