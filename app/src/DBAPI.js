const sql = require('mssql')
const connInfo = require('.\\keys.js');

let sqlConfig = {
  user: connInfo.USER,
  password: connInfo.PASSWORD,
  server: connInfo.SERVER,
  database: connInfo.DB,
  trustServerCertificate: true
}


async function req() {
    console.log("vlizam");
    try {
        await sql.connect(sqlConfig);
        const result = await sql.query`select * from Ships`
        console.log(result)
    } catch (err) {
        console.log(err);
    }
};
req();
