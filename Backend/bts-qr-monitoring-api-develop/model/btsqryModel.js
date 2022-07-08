const mssql = require('mssql');
const connection = require('../config/dbConfig');

const exec = async (sql) => {
    try {
        const pool = await mssql.connect(connection.database);
        const request = await pool.request();
        let result1 = await request.query(sql);
        return (result1.recordset);
    } catch (err) {
        return (err);
    }
}

const responseRowSql = (stationcode, terminalid, refnumber, formdate, todate) => {
    if (stationcode !== '' && terminalid !== '' && refnumber !== '') { //all
        sql = `SELECT COUNT(uniq_req_id)
        FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE terminalid = '${terminalid}'
                        AND reference1 = '${refnumber}'
                        AND branchid = '${stationcode}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))`
        return sql;

    } else if (stationcode !== '' && terminalid !== '' && refnumber === '') { //dh ref
        sql = `SELECT COUNT(uniq_req_id)
        FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE terminalid = '${terminalid}'
                        AND branchid = '${stationcode}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))`
        return sql;

    } else if (stationcode !== '' && terminalid === '' && refnumber === '') { //dh terAref
        sql = `SELECT COUNT(uniq_req_id)
                FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE branchid = '${stationcode}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))`
        return sql;
    } else if (stationcode !== '' && terminalid === '' && refnumber !== '') { //dh ter
        sql = `SELECT COUNT(uniq_req_id)
                 FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE reference1 = '${refnumber}'
                        AND branchid = '${stationcode}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))`
        return sql;

    } else if (stationcode === '' && terminalid !== '' && refnumber !== '') { //dh sc
        sql = `SELECT COUNT(uniq_req_id)
                FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE REQ.terminalid = '${terminalid}'
                        AND reference1 = '${refnumber}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))`
        return sql;
    } else if (stationcode === '' && terminalid === '' && refnumber !== '') { //dh scAter
        sql = `SELECT COUNT(uniq_req_id)
                FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE reference1 = '${refnumber}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))`
        return sql;
    } else if (stationcode === '' && terminalid !== '' && refnumber === '') { //dh scAref
        sql = `SELECT COUNT(uniq_req_id)
                FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE terminalid = '${terminalid}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))`
        return sql;
    } else {
        console.log('rr', formdate, todate)
        sql = `SELECT COUNT(uniq_req_id)
                    FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))`
        return sql;
    }
}

const responseDataSql = (stationcode, terminalid, refnumber, formdate, todate, OFFSETS, limitpage) => {
    if (stationcode !== '' && terminalid !== '' && refnumber !== '') { //all
        sql = `SELECT terminalid, reference1, qrtype, reqdatetime, amount, branchname, confirm_datetime
                    FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE terminalid = '${terminalid}'
                        AND reference1 = '${refnumber}'
                        AND branchid = '${stationcode}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))
                    ORDER BY reqdatetime DESC
                    OFFSET ${OFFSETS} ROWS FETCH NEXT ${limitpage} ROWS ONLY`
        return sql;

    } else if (stationcode !== '' && terminalid !== '' && refnumber === '') { //dh ref
        sql = `SELECT terminalid, reference1, qrtype, reqdatetime, amount, branchname, confirm_datetime
                    FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE terminalid = '${terminalid}'
                        AND branchid = '${stationcode}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))
                    ORDER BY reqdatetime DESC
                    OFFSET ${OFFSETS} ROWS FETCH NEXT ${limitpage} ROWS ONLY`
        return sql;

    } else if (stationcode !== '' && terminalid === '' && refnumber === '') { //dh terAref
        console.log('ooo',stationcode, terminalid, refnumber)
        sql = `SELECT terminalid, reference1, qrtype, reqdatetime, amount, branchname, confirm_datetime
        FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE branchid = '${stationcode}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))
                    ORDER BY reqdatetime DESC
                    OFFSET ${OFFSETS} ROWS FETCH NEXT ${limitpage} ROWS ONLY`
        return sql;
    } else if (stationcode !== '' && terminalid === '' && refnumber !== '') { //dh ter
        sql = `SELECT terminalid, reference1, qrtype, reqdatetime, amount, branchname, confirm_datetime
        FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE reference1 = '${refnumber}'
                    AND branchid = '${stationcode}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))
                    ORDER BY reqdatetime DESC
                    OFFSET ${OFFSETS} ROWS FETCH NEXT ${limitpage} ROWS ONLY`
        return sql;

    } else if (stationcode === '' && terminalid !== '' && refnumber !== '') { //dh sc
        sql = `SELECT terminalid, reference1, qrtype, reqdatetime, amount, branchname, confirm_datetime
        FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE terminalid = '${terminalid}'
                        AND reference1 = '${refnumber}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))
                    ORDER BY reqdatetime DESC
                    OFFSET ${OFFSETS} ROWS FETCH NEXT ${limitpage} ROWS ONLY`
        return sql;
    } else if (stationcode === '' && terminalid === '' && refnumber !== '') { //dh scAter
        sql = `SELECT terminalid, reference1, qrtype, reqdatetime, amount, branchname, confirm_datetime
        FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE reference1 = '${refnumber}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))
                    ORDER BY reqdatetime DESC
                    OFFSET ${OFFSETS} ROWS FETCH NEXT ${limitpage} ROWS ONLY`
        return sql;
    } else if (stationcode === '' && terminalid !== '' && refnumber === '') { //dh scAref
        sql = `SELECT terminalid, reference1, qrtype, reqdatetime, amount, branchname, confirm_datetime
        FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE terminalid = '${terminalid}'
                        AND (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))
                    ORDER BY reqdatetime DESC
                    OFFSET ${OFFSETS} ROWS FETCH NEXT ${limitpage} ROWS ONLY`
        return sql;
    } else {
        sql = `SELECT terminalid, reference1, qrtype, reqdatetime, amount, branchname, confirm_datetime
                    FROM [dbo].[BSS_GW_QR_CONFIRM]
                    WHERE (reqdatetime BETWEEN CONVERT(datetime,'${formdate}') AND CONVERT(datetime, '${todate}'))
                    ORDER BY reqdatetime DESC
                    OFFSET ${OFFSETS} ROWS FETCH NEXT ${limitpage} ROWS ONLY`
        return sql;
    }
}

const getStation = async () => {
    sql = `SELECT bss_loc_des, SP_BranchId
            FROM [dbo].[BSS_GW_QR_LOC_INFO]
            WHERE isActive = 1
            GROUP BY bss_loc_des, SP_BranchId
            ORDER BY bss_loc_des ASC`;
    let response = await exec(sql)
    return response;
}

module.exports = { exec, responseRowSql, responseDataSql, getStation };