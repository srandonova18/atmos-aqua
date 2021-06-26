let sql = require('mssql');
const connInfo = require('.\\keys.js');

let sqlConfig = {
  user: connInfo.USER,
  password: connInfo.PASSWORD,
  server: connInfo.SERVER,
  database: connInfo.DB,
  trustServerCertificate: true
};

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

    async #getPortId(portName) {
        try {
            let pool = await this.#pool;
            const result = await pool.request()
                .input("Name",sql.NVarChar,portName)
                .query("SELECT Id FROM Ports WHERE Name = @Name");

            return result.recordset[0].Id;
        } catch(err) {
            console.log(err);
        }
    }

    async #inputUserData(user)
    {
        let pool = await this.#pool;
        const result = await pool.request()
            .input("FirstName",sql.NVarChar,user.firstName)
            .input("MiddleName",sql.NVarChar,user.middleName)
            .input("LastName",sql.NVarChar,user.lastName)
            .input("Role",sql.Int,user.role)
            .input("Password",sql.NVarChar,user.password)
            .output("UserId",sql.Int)
            .execute("CreateUser");
        
        const { UserId } = result.output;
        return UserId;
    }

    async #linkUserAndPort(portId, userId) {
        try {
            let pool = await this.#pool;
            await pool.request()
                .input("PortId",sql.Int,portId)
                .input("UserId",sql.Int,userId)
                .query("INSERT INTO PortsUsers (PortId, UserId) VALUES (@PortId, @UserId)")
        } catch(err) {
            console.log(err);
        }
    }

    async #getCompanyId(companyName) {
        try {
            let pool = await this.#pool;
            let result = await pool.request()
                .input("CompanyName",sql.NVarChar,companyName)
                .query("SELECT Id FROM Companies WHERE Name = @CompanyName");

            return result.recordset[0].Id;
        } catch(err) {
            console.log(err);
        }
    }

    async #insertShipmentData(shipment) {
        try {

            let pool = await this.#pool;
            let companyRecieverId = await this.#getCompanyId(shipment.companyReciever);
            let companySenderId = await this.#getCompanyId(shipment.companySender);
            let result = await pool.request()
                .input("PortId",sql.Int,shipment.portId)
                .input("ShipId",sql.Int,shipment.shipId)
                .input("CompanyReciever",sql.Int,companyRecieverId)
                .input("CompanySender",sql.Int,companySenderId)
                .input("ContainerCount",sql.Int,shipment.containers.length)
                .output("ShipmentId",sql.Int)
                .execute("CreateShipment")

            return result.output.ShipmentId;
           
        } catch(err) {
            console.log(err);
        }
    }

    async #insertContainersShipmentsData({ containers }, shipmentId) {
        try {
            let pool = await this.#pool;
            for(const cont in containers) {
                await pool.request()
                    .input("ContainerId",sql.Int,containers[cont].id)
                    .input("ShipmentId",sql.Int,shipmentId)
                    .query("INSERT INTO ContainersShipments (ShipmentId, ContainerId) VALUES (@ShipmentId, @ContainerId)")
            }
        } catch(err) {
            console.log(err);
        }
    }

    async #insertGoodsData({ containers }) {
        try {
            let pool = await this.#pool;
            for( const cont in containers) {
                console.log(containers[cont].id);
                let result = await pool.request()
                    .input("ContainerId",sql.Int,containers[cont].id)
                    .execute("GetContainersShipmentsIdByContainersId");
                
                console.log(result);
                let containersShipmentsId = result.recordset[0].Id;

                for( const good of containers[cont].goods) {
                    await pool.request()
                        .input("ContainersShipmentsId",sql.Int,containersShipmentsId)
                        .input("Name",sql.NVarChar,good.name)
                        .input("Weight",sql.Decimal,good.weight)
                        .input("Price",sql.Decimal,good.price)
                        .input("Desc",sql.NVarChar,good.description)
                        .execute("CreateGood")
                }
            }
        } catch(err) {
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

    async createCompany(companyName)
    {
        try {
            let pool = await this.#pool;
            const request = await pool.request()
                .input("CompanyName",sql.NVarChar,companyName)
                .query('INSERT INTO Companies (Name) VALUES (@CompanyName)');

            console.log(request) ;               
        } catch (err) {
            console.log(err);
        }
    }

    async createUser(user, portName) {
        try {
            let portId = await this.#getPortId(portName);
            let userId = await this.#inputUserData(user);
            await this.#linkUserAndPort(portId,userId);
        } catch(err) {
            console.log(err);
        }
    }

    async createContainer(containerId) {
        try {
            let pool = await this.#pool;
            await pool.request()
                .input("ContainerId",sql.Int,containerId)
                .query("INSERT INTO Containers (Id) VALUES (@ContainerId)");
        } catch(err) {
            console.log(err);
        }
    }

    async createShipment(shipment) {
        try {

            let shipmentId = await this.#insertShipmentData(shipment);
            await this.#insertContainersShipmentsData(shipment,shipmentId);
            await this.#insertGoodsData(shipment);

        } catch(err) {
            console.log(err);
        }
    }
}

const PM = new PortsManager;

(async () => {
    //await PM.createShipment(shpmt);
})();

module.exports = {
    PM
}

