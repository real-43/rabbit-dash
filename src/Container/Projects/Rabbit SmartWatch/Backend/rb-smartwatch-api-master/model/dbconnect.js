
const connection = require('../config/dbConfig');
const { Pool } = require('pg');

const pool = new Pool(connection.database);

const exec = async (sql) => {
    try {
        console.log("comemem")
        const result = await pool.query(sql)
        return result.rows
    } catch (err) {
        console.log("query err: ", err)
        return [];
    }
}


const insert_data = async (sql) => {
    try {
        await pool.query(sql)
        return true
    } catch (e) {
        return false
    }
}

const update_data = async (sql) => {
    try {
        await pool.query(sql)
        return true
    } catch (e) {
        return false
    }
}
module.exports = { exec, insert_data, update_data };