let sql = require('mssql');
const connInfo = require('.\\keys.js');

let sqlConfig = {
  user: connInfo.USER,
  password: connInfo.PASSWORD,
  server: connInfo.SERVER,
  database: connInfo.DB,
  trustServerCertificate: true
};

// let portObj = {
//     name: 'Port of Valerian',
//     coordinates: [ {lat: 69,lng: 12}, {lat: 34,lng: 45}]
// }

class PortsManager {
    #pool

    constructor() {
        this.#pool = sql.connect(sqlConfig);
    }

    async #namePort({ name }) {
        try {

            let pool = await this.#pool;

            let results = await pool.request()
                .input("Name",sql.NVarChar,name)
                .output("PortId",sql.Int)
                .execute("CreatePort");
            
            const { PortId } = results.output;
            return PortId;

        } catch(err) {
            console.log(err);
        }
    }

    async #insertPortCoordinates({ coordinates }, portId)
    {
        try {
            let pool = await this.#pool;

            for (const coord in coordinates) {
                await pool.request()
                    .input("Lat",sql.Decimal,coordinates[coord].lat)
                    .input("Lng",sql.Decimal,coordinates[coord].lng)
                    .input("PortId",sql.Int,portId)
                    .execute("AddCoordinates");
            }
        } catch (err) {
            console.log(err);
        }
    }

    async createPort(portObj)
    {
        const portId = await this.#namePort(portObj);
        this.#insertPortCoordinates(portObj, portId);
    }

    async createShip(shipName)
    {
        try {
            let pool = await this.#pool;
            const request = await pool.request()
                .input("ShipName",sql.NVarChar,shipName)
                .query('INSERT INTO Ships (Name) VALUES (@ShipName)');

            console.log(request) ;               
        } catch (err) {
            console.log(err);
        }
    }
}

const PM = new PortsManager;

(async () => {
    await PM.createShip('Davinator');
})();

module.exports = {
    PM
}

