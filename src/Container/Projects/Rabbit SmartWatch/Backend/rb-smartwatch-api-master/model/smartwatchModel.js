const db = require('./dbconnect');

const responseFindSMW = (partner, type, serial, OFFSETS, limitpage, checkbox) => {
    // console.log(partner, type, 'cb', checkbox, serial)
    var sql = '';
    var OrderLimit = ''
    checkbox === true ?
        OrderLimit = `ORDER BY (CASE WHEN A."Mapping_Date_Time" IS NULL THEN 1 ELSE 0 END) ASC, A."Mapping_Date_Time" DESC, 
                        (CASE WHEN A."Job_ID" IS NULL THEN 1 ELSE 0 END) ASC, A."Job_ID" DESC, "Rabbit_Card_ID" DESC
                        Limit ${limitpage} OFFSET ${OFFSETS}`
        :
        OrderLimit = `ORDER BY (CASE WHEN "Mapping_Date_Time" IS NULL THEN 1 ELSE 0 END) ASC,
                        "Refurbished_By_Serial_No" ASC, "Mapping_Date_Time" DESC, 
                        (CASE WHEN A."Job_ID" IS NULL THEN 1 ELSE 0 END) ASC, A."Job_ID" DESC, "Rabbit_Card_ID" DESC
                        Limit ${limitpage} OFFSET ${OFFSETS}`
    console.log('eee', OrderLimit)
    if (serial.length > 0) {
        var condition = ''
        type === "Device_Serial_No" ? condition = `"${type}"='${serial}' OR "Refurbished_By_Serial_No"='${serial}'` : condition = `"${type}"='${serial}'`
        sql = `SELECT A."Device_Serial_No", A."Mapping_Date_Time" AT TIME ZONE 'GMT' AS Mapping_Date_Time, A."Rabbit_Card_ID", A."Device_Model", A."Job_ID", A."Device_Unique_ID",
                A."Refurbished_To", A."Refurbished_Date_Time" AT TIME ZONE 'GMT' AS Refurbished_Date_Time, C."Job_Status"
                FROM public."Mapping_Card" as A
                LEFT JOIN "Jobs" as C ON A."Job_ID" = C."Job_ID"
                WHERE A."Partner_ID" = ${partner} AND ${condition}
                ${OrderLimit}`
    } else {
        sql = `SELECT A."Device_Serial_No", A."Mapping_Date_Time" AT TIME ZONE 'GMT' AS Mapping_Date_Time, A."Rabbit_Card_ID", A."Device_Model", A."Job_ID", A."Device_Unique_ID",
                A."Refurbished_To", A."Refurbished_Date_Time" AT TIME ZONE 'GMT' AS Refurbished_Date_Time, C."Job_Status"
                FROM public."Mapping_Card" as A
                LEFT JOIN "Jobs" as C ON A."Job_ID" = C."Job_ID"
                WHERE A."Partner_ID" = ${partner}
                ${OrderLimit}`
    }
    // if (partner !== null && serial.length > 0) {
    //     sql = `SELECT A."Device_Serial_No", A."Mapping_Date_Time" AT TIME ZONE 'GMT' AS Mapping_Date_Time, A."Rabbit_Card_ID", A."Device_Model", A."Job_ID", A."Device_Unique_ID",
    //             A."Refurbished_To", A."Refurbished_Date_Time" AT TIME ZONE 'GMT' AS Refurbished_Date_Time, C."Job_Status"
    //             FROM public."Mapping_Card" as A
    //             LEFT JOIN "Jobs" as C ON A."Job_ID" = C."Job_ID"
    //             WHERE A."Partner_ID" = ${partner} AND A."Device_Serial_No" = '${serial}' OR A."Rabbit_Card_ID" = '${serial}'
    //             ORDER BY (CASE WHEN A."Mapping_Date_Time" IS NULL THEN 1 ELSE 0 END) DESC, A."Mapping_Date_Time" DESC
    //             Limit ${limitpage} OFFSET ${OFFSETS}`
    // } else if (partner !== null && serial.length == 0) {
    //     sql = `SELECT A."Device_Serial_No", A."Mapping_Date_Time" AT TIME ZONE 'GMT' AS Mapping_Date_Time, A."Rabbit_Card_ID", A."Device_Model", A."Job_ID", A."Device_Unique_ID",
    //             A."Refurbished_To", A."Refurbished_Date_Time" AT TIME ZONE 'GMT' AS Refurbished_Date_Time, C."Job_Status"
    //             FROM public."Mapping_Card" as A
    //             LEFT JOIN "Jobs" as C ON A."Job_ID" = C."Job_ID"
    //             WHERE A."Partner_ID" = ${partner}
    //             ORDER BY (CASE WHEN A."Mapping_Date_Time" IS NULL THEN 0 ELSE 1 END) DESC, A."Mapping_Date_Time" DESC
    //             Limit ${limitpage} OFFSET ${OFFSETS}`
    // } else if (partner === null && serial.length > 0) {
    //     sql = `SELECT A."Device_Serial_No", A."Mapping_Date_Time" AT TIME ZONE 'GMT' AS Mapping_Date_Time, A."Rabbit_Card_ID", A."Device_Model", A."Job_ID", A."Device_Unique_ID",
    //             A."Refurbished_To", A."Refurbished_Date_Time" AT TIME ZONE 'GMT' AS Refurbished_Date_Time, C."Job_Status"
    //             FROM public."Mapping_Card" as A
    //             LEFT JOIN "Jobs" as C ON A."Job_ID" = C."Job_ID"
    //             WHERE A."Device_Serial_No" = '${serial}' OR A."Rabbit_Card_ID" = '${serial}'
    //             ORDER BY (CASE WHEN A."Mapping_Date_Time" IS NULL THEN 1 ELSE 0 END) DESC, A."Mapping_Date_Time" DESC
    //             Limit ${limitpage} OFFSET ${OFFSETS}`
    // } else {
    //     sql = `SELECT A."Device_Serial_No", A."Mapping_Date_Time" AT TIME ZONE 'GMT' AS Mapping_Date_Time, A."Rabbit_Card_ID", A."Device_Model", A."Job_ID", A."Device_Unique_ID",
    //             A."Refurbished_To", A."Refurbished_Date_Time" AT TIME ZONE 'GMT' AS Refurbished_Date_Time, C."Job_Status"
    //             FROM public."Mapping_Card" as A
    //             LEFT JOIN "Jobs" as C ON A."Job_ID" = C."Job_ID"
    //             ORDER BY (CASE WHEN A."Mapping_Date_Time" IS NULL THEN 1 ELSE 0 END) DESC, A."Mapping_Date_Time" DESC
    //             Limit ${limitpage} OFFSET ${OFFSETS}`
    // }
    return db.exec(sql)
}

const count_SMW = (partner, type, serial) => {
    var sql = '';

    if (serial.length > 0) {
        sql = `SELECT COUNT("Rabbit_Card_ID")
                FROM public."Mapping_Card"
                WHERE "Partner_ID" = ${partner} AND "${type}" = '${serial}'`
    } else {
        sql = `SELECT COUNT("Rabbit_Card_ID")
                FROM public."Mapping_Card"
                WHERE "Partner_ID" = ${partner}`
    }
    // if (partner !== null && serial.length > 0) {
    //     sql = `SELECT COUNT("Rabbit_Card_ID")
    //             FROM public."Mapping_Card"
    //             WHERE "Partner_ID" = ${partner} AND "Device_Serial_No" = '${serial}' OR "Rabbit_Card_ID" = '${serial}'`
    // } else if (partner !== null && serial.length == 0) {
    //     sql = `SELECT COUNT("Rabbit_Card_ID")
    //             FROM public."Mapping_Card"
    //             WHERE "Partner_ID" = ${partner}`
    // } else if (partner === null && serial.length > 0) {
    //     sql = `SELECT COUNT("Rabbit_Card_ID")
    //             FROM public."Mapping_Card"
    //             WHERE "Device_Serial_No" = '${serial}' OR "Rabbit_Card_ID" = '${serial}'`
    // } else {
    //     sql = `SELECT COUNT("Rabbit_Card_ID")
    //             FROM public."Mapping_Card"`
    // }
    return db.exec(sql)
}

// const insertCsvToPostgresql = async (data) => {
//     var value = '';
//     for (let [index, element] of data.entries()) {
//         if (index > 0 && index < data.length) {
//             var split_element = element.split(",")
//             // console.log('test', split_element)
//             if (split_element.length === 1) {
//                 // console.log(split_element)
//                 if (split_element[0].length > 0 && split_element[0].length < 13) {
//                     var rescheckRabbitID = await checkRabbitID(split_element[0])
//                     if (rescheckRabbitID.length === 0) {
//                         while (split_element[0].length !== 12) {
//                             split_element[0] = '0' + split_element[0]
//                         }
//                         value += value.length === 0 ? `('${split_element[0]}',1)` : `,('${split_element[0]}',1)`
//                     }
//                 }
//             }
//         }
//     }
//     var sql = `INSERT INTO public."Mapping_Card" ("Rabbit_Card_ID", "Partner_ID")
//                 VALUES ${value}`
//     var resInsert = await db.insert_data(sql)
//     return resInsert

// for (let [index, element] of data.entries()) {
//     if (index > 0 && index < data.length) {
//         var split_element = element.split(",")
//         if (split_element.length === 2) {
//             if (split_element[0].length > 0 && split_element[1].length < 13) {
//                 var resCheckSerial = await checkSerial(split_element[0])
//                 if (resCheckSerial.length === 0) {
//                     while (split_element[1].length !== 12) {
//                         split_element[1] = '0' + split_element[1]
//                     }
//                     value += value.length === 0 ? `('${split_element[0]}','${split_element[1]}',1)` : `,('${split_element[0]}','${split_element[1]}',1)`
//                 }
//             }
//         }
//     }
// }
// var sql = `INSERT INTO public."Mapping_Card" ("Device_Serial_No", "Rabbit_Card_ID", "Partner_ID")
//             VALUES ${value}`
// var resInsert = await db.insert_data(sql)
// return resInsert
// }

const checkRabbitID = async (rabbit_card_id) => {
    var sql = `SELECT "Rabbit_Card_ID"
                FROM public."Mapping_Card"
                WHERE "Rabbit_Card_ID" = '${rabbit_card_id}'`
    // var sql = `SELECT "Device_Serial_No", "Rabbit_Card_ID"
    //             FROM public."Mapping_Card"
    //             WHERE "Device_Serial_No" = '${serial}'`
    return await db.exec(sql)
}

module.exports = { responseFindSMW, count_SMW }