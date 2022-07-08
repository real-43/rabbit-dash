const express = require('express')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const authController = require('./controller/authController');
const smartwatchController = require('./controller/smartwatchController');

const app = express();

const base_api = '/prod/api'

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'true' }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "X-Requested-With,content-type"
    );
    res.setHeader("Access-Control-Allow-Credentials", true);
    // if (req.headers.authorization == "rabbit2020ok") {
    //     next();
    //     } else {
    //     res.send("No Connect");
    // }
    next();
})

app.get(`${base_api}/login/:id`, (req, res) => {
    const { id } = req.params
    authController.checkUser(id, res)
})

app.get(`${base_api}/user`, (req, res) => {
    authController.getUsers(res)
})

app.put(`${base_api}/user`, (req, res) => {
    if (req.body['email'] == null || req.body['role'] == null || req.body['status'] == null) {
        res.json('email is missing')
    }
    authController.updateUser(req.body, res);
})

app.delete(`${base_api}/user`, (req, res) => {
    authController.deleteUser(req.body['email'], res);
})

app.post(`${base_api}/smartwatch_search`, (req, res) => {
    var partner = validate(req.body['partner'])
    var type = validate(req.body['type'])
    var serial = validate(req.body['serial'])
    if(partner && type && serial){
        smartwatchController.smw_Search(req.body, res);
    }else{
        res.json(false)
    };
})

const validate = (input) => {
    input = input.length === 0 ? '0' : input
    var regex = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/g
    return input.match(regex) ? true : false
}

app.listen(9001, () => {
    console.log('Application is running on port 9001')
})