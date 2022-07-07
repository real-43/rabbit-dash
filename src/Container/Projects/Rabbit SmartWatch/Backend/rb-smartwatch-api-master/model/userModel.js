const fsx = require('fs-extra');
const accounts = require('../config/dbUser.json');
// const users = accounts.users;

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

const getUsers = () => {
    return accounts;
}

const updateUser = (email, role, status) => {
    for (let [i, user] of accounts.users.entries()) {
        if (user.email == email) {
            // accounts.users.splice(i, 1);
            accounts.users[i]['role'] = role
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

module.exports = { getUser, getUsers, updateUser, deleteUser }