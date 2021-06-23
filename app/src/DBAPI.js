let sql = require('mssql');
const connInfo = require('.\\keys.js');

let sqlConfig = {
  user: connInfo.USER,
  password: connInfo.PASSWORD,
  server: connInfo.SERVER,
  database: connInfo.DB,
  trustServerCertificate: true
};



function getPortId(portName)
{
    return sql.connect(sqlConfig).then(pool=>{
        return pool.request()
            .input("name",sql.NVarChar,portName)
            .query('SELECT id FROM Ports WHERE Name = @name');
    }).then(res=>{
        console.log(res.recordset[0].id);
        return res.recordset[0].id;
    });
}

function createPort(portObj)
{
    let id='a';
    sql.connect(sqlConfig).then(pool=>{
        let req = pool.request();
        req.input("name",sql.NVarChar,portObj.name)
            .query('INSERT INTO Ports (Name) VALUES (@name)');
        pool.request()
            .input("name",sql.NVarChar,portObj.name)
            .query('SELECT id FROM Ports WHERE Name = @name');
    }).then(res=>{
        console.log(res);
        console.log(id);
    }).catch( err =>{
        console.log(err);
    })
}
console.log(getPortId('BurgasLmao'));
//createPort({name:'niga'})






