const userModel = require('../model/userModel');

const checkUser = async (id, res) => {
    let data = await userModel.getUser(id);
    console.log(data)
    if (data) {
        let response = {
            status: true,
            data: data
        }
        res.json(response)
    } else {
        let response = {
            status: false
        }
        res.json(response)
    }
}

const getUsers = async (res) => {
    let response = await userModel.getUsers();
    res.json(response)
}

const updateUser = async (body, res) => {
    let response = await userModel.updateUser(body['email'], body['role'], body['status']);
    console.log(response)
    res.json(response)
}

const deleteUser = async (id, res) => {
    console.log('test')
    let response = await userModel.deleteUser(id);
    res.json(response)
}
module.exports = { checkUser, getUsers, updateUser, deleteUser };