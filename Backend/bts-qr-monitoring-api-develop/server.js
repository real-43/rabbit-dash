const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const btsMonitor_controller = require('./controller/btsMonitorController');
const authController = require('./controller/authController');

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());

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
    if (req.headers.authorization == "rabbit2020ok") {
        next();
    } else {
        res.send("No Connect");
    }
})

app.post('/api/bss_gw_qr_req', async (req, res) => {
    console.log(req.body)
    await btsMonitor_controller.getData(req, res);
})

/* ----- start auth ----- */
app.post('/api/login', async (req, res) => {
    authController.Login(req.body, res)
})

app.post('/api/logout', async (req, res) => {
    authController.Logout(req.body, res)
})

app.post('/api/getuser', async (req, res) => {
    authController.getUsers(req.body, res)
})

/* ----- endauth ----- */

app.post('/api/bss_gw_qr_req_page', async (req, res) => {
    await btsMonitor_controller.getDatas(req, res); 
})

app.get('/api/get_bss_stations', (req, res) => {
    btsMonitor_controller.getBssStation(res)
})

app.get('/api/login/:id', (req, res) => {
    const { id } = req.params
    authController.checkUser(id, res)
})

app.get('/api/user', (req, res) => {
    authController.getUsers(res) 
})

app.put('/api/user', (req, res) => {
    if(req.body['email'] == null || req.body['role'] == null || req.body['status'] == null) {
        res.json('email is missing')
    }
    authController.updateUser(req.body, res);
})

app.delete('/api/user', (req, res) => {
    authController.deleteUser(req.body['email'], res);
})

app.get('/api/logout/:id', (req, res) => {
    const { id } = req.params
    authController.checkUser(id, res)
})

app.get('/api/getuser', (req, res) => {
    authController.getUsers(res)

})

app.get('/api/test', (req, res) => {
    
})

app.listen(9000, () => {
    console.log('Application is running on port 9000')
})

