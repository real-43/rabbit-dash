const btsqryModel = require('../model/btsqryModel');

const getData = async (req, res) => {
    let stationcode = req.body.stationCode ? req.body.stationCode : ""
    let terminalid = req.body.terminalId ? req.body.terminalId : ""
    let refnumber = req.body.refNumber ? req.body.refNumber : ""
    // let formdate = req.body.formDate
    let formdate = req.body.formDate+'T00:00:00.000Z'
    let splittodate = (req.body.toDate).split('-')
    // let todate = splittodate[0]+'-'+splittodate[1]+'-'+(+splittodate[2]+1)
    let todate = req.body.toDate+'T23:59:59.999Z'
    let page = req.body.page;
    let limitpage = req.body.limitpage;
    let OFFSETS = (page - 1) * limitpage;
    let sqldata = await btsqryModel.responseDataSql(stationcode, terminalid, refnumber, formdate, todate, OFFSETS, limitpage);
    let rowsql = await btsqryModel.responseRowSql(stationcode, terminalid, refnumber, formdate, todate);
    let resdata = await btsqryModel.exec(sqldata);
    let rescount = await btsqryModel.exec(rowsql);
    console.log(rescount)
    let data = {
        data: resdata,
        rowcount: rescount
    }
    res.send(data)
}

const getDatas = async (req, res) => {
    let stationcode = req.body.stationCode ? req.body.stationCode : ""
    let terminalid = req.body.terminalId ? req.body.terminalId : ""
    let refnumber = req.body.refNumber ? req.body.refNumber : ""
    // let formdate = req.body.formDate
    let formdate = req.body.formDate+'T00:00:00.000Z'
    let splittodate = (req.body.toDate).split('-')
    // let todate = splittodate[0]+'-'+splittodate[1]+'-'+(+splittodate[2]+1)
    let todate = req.body.toDate+'T23:59:59.999Z'
    let page = req.body.page;
    let limitpage = req.body.limitpage;
    let OFFSETS = (page - 1) * limitpage;

    let sqldata = await btsqryModel.responseDataSql(stationcode, terminalid, refnumber, formdate, todate, OFFSETS, limitpage);
    let resdata = await btsqryModel.exec(sqldata);
    let data = {
        data: resdata
    }
    res.send(data)
}

const getBssStation = async (res) => {
    let response = await btsqryModel.getStation();
    res.json(response)
}

/*----- End Query DB -----*/

module.exports = { getData, getDatas, getBssStation };