const userModel = require('../model/userModel');
const { getData } = require('./btsMonitorController');


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



const updateUser = async (body, res) => {
    let response = await userModel.updateUser(body['email'], body['role'], body['status']);
    res.json(response)
}

const deleteUser = async (id, res) => {
    let response = await userModel.deleteUser(id);
    res.json(response)
}

const Login = async (body, res) => {
    var data = await userModel.resDBLogin(body.username, body.password)
    if (data.length > 0) {
        await userModel.LoginDate(data[0]['UserID'])
        var response = {
            status: true,
            data: data
        }
        res.json(response)
    } else {
        var response = {
            status: false
        }
        res.json(response)
    }
}

const Logout = async (body, res) => {
    var data = await userModel.LogoutDate(body['username'])
    res.json(data)
}

const getUsers = async (res) => {
    let response = await userModel.getUsers();
    res.json(response)
}

module.exports = { checkUser, getUsers, updateUser, deleteUser, Login, Logout };