
let sql = require('mssql');
const connInfo = require('.\\keys.js');

let sqlConfig = {
  user: connInfo.USER,
  password: connInfo.PASSWORD,
  server: connInfo.SERVER,
  database: connInfo.DB,
  port: connInfo.PORT,
  trustServerCertificate: true
};

class ShipManager {

    #pool;

    constructor(pool) {
        this.#pool = pool || sql.connect(sqlConfig);
    }

    createShip = async function(shipName)
    {
        try {
            let pool = await this.#pool;
            const request = await pool.request()
                .input("ShipName",sql.NVarChar,shipName)
                .query('INSERT INTO Ships (Name) VALUES (@ShipName)');

            console.log("DBAPI.js: Add ship with name "+shipName);               
        } catch (err) {
            console.log(err);
        }
    }

    deleteShip = async function (shipName) {
        try {
            let pool = await this.#pool;
            const request = await pool.request()
                .input("ShipName",sql.NVarChar,shipName)
                .query('DELETE FROM Ships WHERE Name = @ShipName');

                console.log("DBAPI.js: Deleted ship with name: "+shipName);               
        } catch (err) {
            console.log(err);
        }
    }

    updateShipName = async function (shipName,newName) {
        try {
            let pool = await this.#pool;
            const request = await pool.request()
                .input("ShipName",sql.NVarChar,shipName)
                .input("NewName",sql.NVarChar,newName)
                .query('UPDATE Ships SET Name = @NewName WHERE Name = @ShipName');

                console.log("DBAPI.js: Update old ship: "+shipName+" and replaced it with: "+newName);               
        } catch (err) {
            console.log(err);
        }
    }

    getAllShips = async function() {
        try {
            let pool = await this.#pool;
            const request = await pool.request()
                .query('SELECT Name FROM Ships');
            
            console.log("DBAPI.js: Getting all ships from DB");  
            return request.recordset;        
        } catch (err) {
            console.log(err);
        }
    }

    getShipId = async function(shipName) {
        try {
            let pool = await this.#pool;
            let result = await pool.request()
                .input("ShipName",sql.NVarChar,shipName)
                .query('SELECT Id FROM Ships WHERE Name = @ShipName');

                console.log("DBAPI.js: Getting ship id by name: "+shipName);      
                
            return result.recordset[0].Id;
        } catch (err) {
            console.log(err);
        }
    }
};

class UserManager {

    #pool;

    constructor(pool) {
        this.#pool = pool || sql.connect(sqlConfig);
    }

    #getPortId = async function(portName) {
        try {
            let pool = await this.#pool;
            const result = await pool.request()
                .input("Name",sql.NVarChar,portName)
                .query("SELECT Id FROM Ports WHERE Name = @Name");

            console.log("DBAPI.js: Getting Id of port: "+portName);  
            return result.recordset[0].Id;
        } catch(err) {
            console.log(err);
        }
    }

    getPortName = async function (portId) {
        try {
            let pool = await this.#pool;
            const result = await pool.request()
                .input("Id",sql.Int,portId)
                .query("SELECT Name FROM Ports WHERE Id = @Id");

            console.log("DBAPI.js: Getting name of port with id: "+portId);  
            return result.recordset[0].Name;
        } catch(err) {
            console.log(err);
        }
    }

    getPortIdByUserId = async function (userId) {
        try {
            let pool = await this.#pool;
            const result = await pool.request()
                .input("UserId",sql.Int,userId)
                .query("SELECT PortId FROM PortsUsers WHERE UserId = @UserId");

            console.log("DBAPI.js: Getting portId by userId: "+userId);  
            if(result.rowsAffected[0])
                return result.recordset[0].PortId;
            return 0;
        } catch(err) {
            console.log(err);
        }
    }

    #inputUserData = async function(user)
    {
        let pool = await this.#pool;
        const result = await pool.request()
            .input("FirstName",sql.NVarChar,user.firstName)
            .input("MiddleName",sql.NVarChar,user.middleName)
            .input("LastName",sql.NVarChar,user.lastName)
            .input("Role",sql.Int,user.role)
            .input("Password",sql.NVarChar,user.password)
            .input("Email",sql.NVarChar,user.email)
            .output("UserId",sql.Int)
            .execute("CreateUser");
        
        console.log("DBAPI.js: Created new user: "+user.email);  
        const { UserId } = result.output;
        return UserId;
    }

    #linkUserAndPort = async function(portId, userId) {
        try {
            let pool = await this.#pool;
            await pool.request()
                .input("PortId",sql.Int,portId)
                .input("UserId",sql.Int,userId)
                .query("INSERT INTO PortsUsers (PortId, UserId) VALUES (@PortId, @UserId)")
            
            console.log("DBAPI.js: Linking port: "+portId+" with user: "+userId);  
        } catch(err) {
            console.log(err);
        }
    }

    getUserByNames = async function(user) {
        try {
            let pool = await this.#pool;
            let result = await pool.request()
                .input("FirstName",sql.NVarChar,user.firstName)
                .input("MiddleName",sql.NVarChar,user.middleName)
                .input("LastName",sql.NVarChar,user.lastName)
                .query("SELECT [Id],[FirstName],[MiddleName],[LastName],[Role],[Email] FROM Users")
            
            console.log("DBAPI.js: Getting user by names: "+user.firstName+" "+user.middleName+" "+user.lastName);  
            return result.recordset[0];
        } catch(err) {
            console.log(err);
        }
    }

    getUserByEmail = async function (email)  {
        try {
            let pool = await this.#pool;
            let result = await pool.request()
                .input("Email",sql.NVarChar,email)
                .query("SELECT [Id],[FirstName],[MiddleName],[LastName],[Role],[Email] FROM Users WHERE Email like @Email")
            
            console.log("DBAPI.js: Getting user by email: "+email);  
            return result.recordset[0];
        } catch(err) {
            console.log(err);
        }
    }

    getUserById = async function(id) {
        try {
            let pool = await this.#pool;
            let result = await pool.request()
                .input("UserId",sql.Int,id)
                .query("SELECT [FirstName],[MiddleName],[LastName],[Role],[Email] FROM Users WHERE Id = @UserId")
            
            console.log("DBAPI.js: Getting user by id: "+id);  
            return result.recordset[0];
        } catch(err) {
            console.log(err);
        }
    }

    getAllUsers = async function () {
        try {
            let pool = await this.#pool;
            let result = await pool.request()
                .query("SELECT [FirstName],[MiddleName],[LastName],[Role],[Email] FROM Users")
            
            console.log("DBAPI.js: Getting all users from DB");  
            return result.recordset;
        } catch(err) {
            console.log(err);
        }
    }

    updateUser = async function (oldUser,newUser) {
        
        try {
            let pool = await this.#pool;

            let res = await this.getUserByNames(oldUser);
            let userId = res.Id;

            for(const key in newUser) {
                oldUser[key] = newUser[key];
            }

            let result = await pool.request()
                .input("FirstName",sql.NVarChar,oldUser.firstName)
                .input("MiddleName",sql.NVarChar,oldUser.middleName)
                .input("LastName",sql.NVarChar,oldUser.lastName)
                .input("Password",sql.NVarChar,oldUser.password)
                .input("Email",sql.NVarChar,oldUser.email)
                .input("Role",sql.Int,oldUser.role)
                .input("UserId",sql.Int,userId)
                .execute("UpdateUser")
            
            console.log("DBAPI.js: Updating user: "+oldUser.email);  
            return result.recordset;
        } catch(err) {
            console.log(err);
        }
    }

    createUser = async function(user, portName) {
        try {
            let portId = await this.#getPortId(portName);
            let userId = await this.#inputUserData(user);
            await this.#linkUserAndPort(portId,userId);

            console.log("DBAPI.js: Creating new user: "+user.email+" in port: "+portName);  
        } catch(err) {
            console.log(err);
        }
    }

    doesUserExist = async function(password, email) {
        try {
            let pool = await this.#pool;

            let result = await pool.request()
                .input("Password",sql.NVarChar,password)
                .input("Email",sql.NVarChar,email)
                .query("SELECT Id FROM Users WHERE Password like @Password AND Email like @Email")
            
                console.log("DBAPI.js: Checking if user: "+email+" exists");  
            if(result.rowsAffected[0])
                return result.recordset[0].Id;
            return 0;
        } catch(err) {
            console.log(err);
        }
    }

    deleteUser = async function(userId) {
        try {
            let pool = await this.#pool;
            console.log(await pool.request()
                .input("UserId",sql.Int,userId)
                .query("DELETE FROM PortsUsers WHERE UserId like @UserId"))

            console.log(await pool.request()
                .input("UserId",sql.Int,userId)
                .query("DELETE FROM Users WHERE Id like @UserId"))

            console.log("DBAPI.js: Delete user: "+userId);  
        } catch(err) {
            console.log(err);
        }
    }
}

class PortManager {

    #pool;

    constructor(pool) {
        this.#pool = pool || sql.connect(sqlConfig);
    }

    #getPortId = async function(portName) {
        try {
            let pool = await this.#pool;
            const result = await pool.request()
                .input("Name",sql.NVarChar,portName)
                .query("SELECT Id FROM Ports WHERE Name = @Name");

            console.log("DBAPI.js: Getting port: "+portName+" by id");  
            return result.recordset[0].Id;
        } catch(err) {
            console.log(err);
        }
    }

    #namePort = async function({ name }) {
        try {

            let pool = await this.#pool;

            let results = await pool.request()
                .input("Name",sql.NVarChar,name)
                .output("PortId",sql.Int)
                .execute("CreatePort");
            
                console.log("DBAPI.js: Giving a name to port: "+name);  
            const { PortId } = results.output;
            return PortId;

        } catch(err) {
            console.log(err);
        }
    }

    #insertPortCoordinates = async function({ coordinates }, portId)
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
            console.log("DBAPI.js: Inserted coordinates in port: "+portId);  
        } catch (err) {
            console.log(err);
        }
    }

    #getCoordinatesByPortsCoordinatesTableCoordinatesId = async function(coordinatesId) {
        try {
            let pool = await this.#pool;

            let result = await pool.request()
                .input("CoordinatesId",sql.Int,coordinatesId)
                .query("Select [Lat],[Lng] FROM Coordinates WHERE Id = @CoordinatesId")
            
            console.log("DBAPI.js: Getting coordinates...");  
            return result.recordset[0];
        } catch(err) {
            console.log(err);
        }
    }

    #getAllPorts = async function() {
        try {
            let pool = await this.#pool;
            let result = await pool.request()
                .query("SELECT * FROM Ports");

            console.log("DBAPI.js: Getting all ports");  

            return result.recordset;

        } catch(err) {
            console.log(err);
        }
    }

    getPortCoordinates = async function () {
        try {
            let pool = await this.#pool;
            let data = [], tmp;

            let result = await pool.request()
                .query("SELECT [PortId],[CoordinatesId] FROM PortsCoordinates")
            let ports = await this.#getAllPorts();

            for(let port of ports) {

                tmp = {portName: port.Name, coords: []};

                for(let obj of result.recordset) {

                    if(port.Id==obj.PortId) {
                        
                        tmp.coords.push(await this.#getCoordinatesByPortsCoordinatesTableCoordinatesId(obj.CoordinatesId));
                        
                    }
                }

                data.push(tmp);
            }

            console.log("DBAPI.js: Getting all ports' coordinates");  
            return data;

        } catch(err) {
            console.log(err);
        }
    }

    createPort = async function(portObj)
    {
        try {
        const portId = await this.#namePort(portObj);
        this.#insertPortCoordinates(portObj, portId);

        console.log("DBAPI.js: Creating port: "+portObj.name);  

        } catch(err) {
            console.log(err);
        }
    }

    updatePortName= async function(portId,newName) {
        try {
            let pool = await this.#pool;
            await pool.request()
                .input("PortId",sql.Int,portId)
                .input("NewName",sql.NVarChar,newName)
                .query("UPDATE Ports SET Name = @NewName WHERE Id = @PortId")

            console.log("DBAPI.js: Updating name of port: "+portId+" with new name: "+newName);  
        } catch(err) {
            console.log(err);
        }
    }
}

class ContainerManager {

    #pool;

    constructor(pool) {
        this.#pool = pool || sql.connect(sqlConfig);
    }

    createContainer = async function(containerId) {
        try {
            let pool = await this.#pool;
            await pool.request()
                .input("ContainerId",sql.Int,containerId)
                .query("INSERT INTO Containers (Id) VALUES (@ContainerId)");

            console.log("DBAPI.js: Creating container: "+containerId);  
        } catch(err) {
            console.log(err);
        }
    }

    deleteContainer = async function(containerId) {
        try {
            let pool = await this.#pool;
            await pool.request()
                .input("ContainerId",sql.Int,containerId)
                .query("DELETE FROM Containers WHERE Id = @ContainerId");

            console.log("DBAPI.js: Deleting container: "+containerId);  
        } catch(err) {
            console.log(err);
        }
    }

    getAllContainers = async function () {
        try {

            let pool = await this.#pool;
            let containers = await pool.request()
                .query("SELECT Id FROM Containers");

            console.log("DBAPI.js: Getting all containers");  

            return containers.recordset;

        } catch(err) {
            console.log(err);
        }
    }
}

class CompanyManager {

    #pool;

    constructor(pool) {
        this.#pool = pool || sql.connect(sqlConfig);
    }

    createCompany = async function(companyName) 
    {
        try {
            let pool = await this.#pool;
            const request = await pool.request()
                .input("CompanyName",sql.NVarChar,companyName)
                .query('INSERT INTO Companies (Name) VALUES (@CompanyName)');

            console.log("DBAPI.js: Creating company: "+companyName);               
        } catch (err) {
            console.log(err);
        }
    }

    getAllCompanies = async function () {
        try {
            let pool = await this.#pool;
            const request = await pool.request()
                .query('SELECT Name FROM Companies');
            
            console.log("DBAPI.js: Getting all company names");  
            return request.recordset;
        } catch (err) {
            console.log(err);
        }
    }

    deleteCompany = async function(companyName) {
        try {
            let pool = await this.#pool;
            await pool.request()
                .input("CompanyName",sql.NVarChar,companyName)
                .query('DELETE FROM Companies WHERE Name = @CompanyName');
            
            console.log("DBAPI.js: Deleting company: "+companyName);  
        } catch (err) {
            console.log(err);
        }
    }

    updateCompanyName = async function(oldName, newName) {
        try {
            let pool = await this.#pool;
            await pool.request()
                .input("OldName",sql.NVarChar,oldName)
                .input("NewName",sql.NVarChar,newName)
                .query('UPDATE Companies SET Name = @NewName WHERE Name like @OldName');
            
            console.log("DBAPI.js: Updating company: "+oldName+" with new name: "+newName);  
        } catch (err) {
            console.log(err);
        }
    }
}

class ShipmentManager {

    #pool;

    constructor(pool) {
        this.#pool = pool || sql.connect(sqlConfig);
    }

    getCompanyId = async function(companyName) {
        try {
            let pool = await this.#pool;
            let result = await pool.request()
                .input("CompanyName",sql.NVarChar,companyName)
                .query("SELECT Id FROM Companies WHERE Name = @CompanyName");

            console.log("DBAPI.js: Getting company: "+companyName);  
            return result.recordset[0].Id;
        } catch(err) {
            console.log(err);
        }
    }

    getCompanyName = async function(companyId) {
        try {
            let pool = await this.#pool;
            let result = await pool.request()
                .input("CompanyId",sql.NVarChar,companyId)
                .query("SELECT Name FROM Companies WHERE Id = @CompanyId");

            console.log("DBAPI.js: Getting company: "+companyId);  
            return result.recordset[0].Name;
        } catch(err) {
            console.log(err);
        }
    }

    #getShipName = async function(shipId) {
        try {
            let pool = await this.#pool;
            let result = await pool.request()
                .input("ShipId",sql.NVarChar,shipId)
                .query("SELECT Name FROM Ships WHERE Id = @ShipId");

            console.log("DBAPI.js: Getting ship: "+shipId);  
            return result.recordset[0].Name;
        } catch(err) {
            console.log(err);
        }
    }


    #insertShipmentData = async function(shipment) {
        try {

            let pool = await this.#pool;
            let companyRecieverId = await this.getCompanyId(shipment.companyReciever);
            let companySenderId = await this.getCompanyId(shipment.companySender);
            let result = await pool.request()
                .input("PortId",sql.Int,shipment.portId)
                .input("ShipId",sql.Int,shipment.shipId)
                .input("CompanyReciever",sql.Int,companyRecieverId)
                .input("CompanySender",sql.Int,companySenderId)
                .input("ContainerCount",sql.Int,shipment.containers.length)
                .output("ShipmentId",sql.Int)
                .execute("CreateShipment")

            console.log("DBAPI.js: Inserting shipment data: "+shipment);
            return result.output.ShipmentId;
           
        } catch(err) {
            console.log(err);
        }
    }

    #insertContainersShipmentsData = async function({ containers }, shipmentId) {
        try {
            let pool = await this.#pool;
            for(const cont in containers) {
                await pool.request()
                    .input("ContainerId",sql.Int,containers[cont].id)
                    .input("ShipmentId",sql.Int,shipmentId)
                    .query("INSERT INTO ContainersShipments (ShipmentId, ContainerId) VALUES (@ShipmentId, @ContainerId)")
            }
            console.log("DBAPI.js: Inserting containers into shipment");  
        } catch(err) {
            console.log(err);
        }
    }

    #insertGoodsData = async function({ containers }) {
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
            console.log("DBAPI.js: Inserting goods into conainers");  
        } catch(err) {
            console.log(err);
        }
    }

    createShipment = async function(shipment) {
        try {

            let shipmentId = await this.#insertShipmentData(shipment);
                console.log(`shipmentId:${shipmentId}`);
            await this.#insertContainersShipmentsData(shipment,shipmentId);
            await this.#insertGoodsData(shipment);

            console.log("DBAPI.js: Creating shipment: "+shipment);  
        } catch(err) {
            console.log(err);
        }
    }

    #getPortId = async function (portName) {
        try {

            let pool = await this.#pool;
            let results = await pool.request()
                .input("PortName",sql.NVarChar,portName)
                .query("SELECT Id FROM Ports WHERE Name like @PortName")

            console.log("DBAPI.js: Getting port: "+portName);  
            return results.recordset[0].Id;
        } catch(err) {
            console.log(err);
        }
    }

    #getShipmentInformation = async function(shipmentId) {
        try {

            let pool = await this.#pool;
            let shipment = {};

            let results = await pool.request()
                .input("ShipmentId",sql.Int,shipmentId)
                .query("SELECT [ShipId],[ContainerCount],[CompanyReciever],[CompanySender] FROM Shipments WHERE Id = @ShipmentId")

            shipment.shipId = await this.#getShipName(results.recordset[0].ShipId);
            shipment.containerCount = results.recordset[0].ContainerCount;
            shipment.companySender = await this.getCompanyName(results.recordset[0].CompanySender);
            shipment.companyReciever = await this.getCompanyName(results.recordset[0].CompanyReciever);

            console.log("DBAPI.js: Getting shipment information: "+shipmentId);  

            return shipment;

        } catch(err) {
            console.log(err);
        }
    }

    #getContainersFromShipmentId = async function(shipmentId) {
        try {
            let pool = await this.#pool;
            let containers = [], containersShipmentsIds = [];
            
            let request = await pool.request()
                .input("ShipmentId",sql.Int,shipmentId)
                .query("SELECT Id,ShipmentId,ContainerId FROM ContainersShipments WHERE ShipmentId = @ShipmentId");
            
            for(let record of request.recordset) {
                let obj = {id: -1,goods: []};
                obj.id = record.ContainerId;
                containers.push(obj);
                containersShipmentsIds.push(record.Id);
            }

            console.log("DBAPI.js: Getting containers from shipment: "+shipmentId);  

            return {containers, containersShipmentsIds};

        } catch(err) {
            console.log(err);
        }
    }

    #getGoodsFromContainer= async function (containersShipmentsId) {
        try {
            let pool = await this.#pool;

            let results = await pool.request()
                .input("ContainersShipmentsId",sql.Int,containersShipmentsId)
                .query("SELECT Id, Name, Weight, Price, Description FROM Goods WHERE ContainersShipmentsId = @ContainersShipmentsId")
            
            console.log("DBAPI.js: Getting goods from containers");  
            return results.recordset;
        } catch(err) {
            console.log(err);
        }
    }

    getShipmentFromPort = async function(portName,shipmentId) {
        try {

            let pool = await this.#pool;
            let portId = await this.#getPortId(portName);


            let shipment = await this.#getShipmentInformation(shipmentId);
            let res = await this.#getContainersFromShipmentId(shipmentId);

            shipment.id = shipmentId;

            shipment.containers = res.containers;
            let ContainersShipmentsId = res.containersShipmentsIds;

            for(let obj in shipment.containers) {
                for(let cont of ContainersShipmentsId) {
                    shipment.containers[obj].goods.push(await this.#getGoodsFromContainer(cont))
                }
            }

            console.log("DBAPI.js: Getting shipemtn: "+shipmentId+" from port: "+portName);  
            return shipment;

        } catch(err) {
            console.log(err);
        }
    }
}

class DBManager {

    #pool;

    constructor() {
        this.#pool = sql.connect(sqlConfig);

        let instances = [
            new ShipManager(this.#pool),
            new UserManager(this.#pool),
            new PortManager(this.#pool),
            new ContainerManager(this.#pool),
            new CompanyManager(this.#pool),
            new ShipmentManager(this.#pool)
        ];

        for (const instance of instances) {
            for(const key in instance) {
                if(typeof instance[key] === "function") {
                    this[key] = instance[key].bind(instance);
                }
            }
        }
        
    }
}

const DBM = new DBManager();
module.exports = { DBM }