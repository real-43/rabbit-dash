const smartwatchModel = require('../model/smartwatchModel');
const postSearch = (req, res) => {
    let data = [
        {
            device_serial: '123456789',
            rabbit_card_serial: '088 12312313',
            initial_datetime: '12/12/2020 12:23:45'
        },
        {
            device_serial: '44444444444',
            rabbit_card_serial: '32 12312313',
            initial_datetime: '12/12/2020 12:23:45'
        }
    ]
    let response = {
        'status_code': 200,
        'status_description': 'success',
        'data': data,
        'app_version': 'v.0.0.1'
    }

    console.log("response bend", response)
    res.json(response);
}

const smw_Search = async (body, res) => {
    console.log("body", body)
    var page = body.page;
    console.log("page", page)
    var limitpage = body.limitpage;
    console.log("limitpage", limitpage)
    var OFFSETS = (page - 1) * limitpage;
    console.log("offsets", OFFSETS)
    
    var resdata = await smartwatchModel.responseFindSMW(body['partner'], body['type'], body['serial'], OFFSETS, limitpage, body["checkbox"]);

    var rescount = await smartwatchModel.count_SMW(body['partner'], body['type'], body['serial']);
    
    let data = {
        data: resdata,
        rowcount: rescount
    }

    console.log("data", data)
    res.json(data)
    // var response = await smartwatchModel.responseFindSMW(req.body['partner'], req.body['type'], req.body['serial'])
    // res.json(response)
}

// const ImportCsvFile = async (file_name, file_data, res) => {
//     var data_splits = file_data.split("\r\n")
//     if (file_name.includes('mapping_file')) {
//         if (data_splits.length > 2) {
//             var resInsertDB = await smartwatchModel.insertCsvToPostgresql(data_splits)
//             res.json(resInsertDB)
//         }
//     }
// }

module.exports = { postSearch, smw_Search };