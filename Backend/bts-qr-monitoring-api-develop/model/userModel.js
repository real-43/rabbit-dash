const fsx = require('fs-extra');
const accounts = require('../config/dbUser.json');
const account = require('../config/dbU.json')
const { Client } = require('pg')
const db = require('./dbconnect')

// const users = accounts.users;

/* ----- Start DB USER ----- */
const resDBLogin = async (username, password) => {
    var sql = `SELECT "UserID", "Username"
	                FROM "btsqr-monitoring"."User"
                    WHERE "Username" = '${username}' AND "Password" = '${password}'`;
    return await db.query(sql)
}

const LoginDate = async (userID) => {
    var sql = `UPDATE "btsqr-monitoring"."User"
                    SET "Login_Date_Time"= now()
                    WHERE "UserID"=${userID}`
    return await db.update(sql)
}

const LogoutDate = async (Username) => {
    var sql = `UPDATE "btsqr-monitoring"."User"
                    SET "Logout_Date_Time"= now()
                    WHERE "Username"='${Username}'`
    return await db.update(sql)
}

const getUsers = async (id) => {
    var sql = `Select "UserID", "Username"
                        FROM "btsqr-monitoring"."User"`
    return await db.update(sql)
}
/* ----- END DB USER ----- */


// With async/await:
const writeFile = async (detail) => {
    try {
        let path = `../config/dbUser.json`
        await fsx.outputFile(path, detail)

        const data = await fsx.readFile(path, 'utf8')

        console.log(data) // => hello!
    } catch (err) {
        console.error(err)
    }
}



const getUser = (id) => {
    return accounts.users.find(user => user.email === id)
}

const updateUser = (email, role, status) => { //******** */
    for (let [i, user] of accounts.users.entries()) {
        if (user.email == email) {
            // accounts.users.splice(i, 1);
            accounts.users[i]['Password'] = role //**** */
            accounts.users[i]['status'] = status
        }
    }
    writeFile(accounts)
    return accounts
}

const deleteUser = (id) => {
    for (let [i, user] of accounts.users.entries()) {
        if (user.email == id) {
            accounts.users.splice(i, 1);
        }
    }
    writeFile(accounts)
    return accounts
}

const resUser = (username, password) => {
    return account.users.find(test =>
        test.user === username && test.pass === password
    )
}

module.exports = { getUser, resDBLogin, LoginDate, LogoutDate, updateUser, deleteUser, resUser, getUsers }