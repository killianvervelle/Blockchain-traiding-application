## Blockchain-traiding-application

**Team Members :** Killian Vervelle

### Project: Blockchain-traiding-application

This project merges blockchain technology, specifically Hyperledger Fabric and Fabric Token SDK, with Spring Boot, React, and MySQL. The application offers users the opportunity to seamlessly exchange their local currency for gold-backed tokens and conduct international settlements. By leveraging the transparency and security of blockchain, users can trust in the integrity of their transactions while benefiting from the stability of gold-backed assets. With a modular architecture encompassing frontend, backend, blockchain, and database layers, the application ensures a user-friendly experience while providing a reliable platform for currency trading and settlements.

### Views

#### User Dashboard
The Dashboard component displays user-related statistics and visualizations based on transaction data, account balances, gold prices, and exchange rates.  

![Image Alt Text](img/dash.png)

#### Request Handler Interface
The RequestHandler component facilitates interactions with the blockchain. Depending on the user's role, they can perform various actions, including submitting issuance requests, transferring and redeeming tokens, or issuing tokens to customers.   

![Image Alt Text](img/requestCustomer.png)

![Image Alt Text](img/requestIssuer.png)

### functionalities 

#### Running the frontend in React
Prerequisites:
- Node.js: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
- npm: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm
```
cd frontend
# Install the necessary dependencies for the project 
npm install
# Run the frontend
npm start   
```
#### Running the MySQL database in Docker
Prerequisites:
- MySQL: https://dev.mysql.com/downloads/installer/
- MySQL workbench: https://dev.mysql.com/downloads/workbench/
- docker v26.1.1: https://docs.docker.com/get-docker/
```
cd my-sql
# Build the docker image
docker build -t my-mysql .
# Run the docker container
docker run --name my-mysql-container -p 3307:3306 -e MYSQL_ROOT_PASSWORD=rootpassword -e MYSQL_DATABASE=users -d my-mysql
```

Open MySQL workbench and create a new connection:
- Go to the `Database menu` -> `Manage Connections` -> `New`.
- Enter connection details by providing a random name for your connection. Set the `username` to `root`, the `port number` to `3307`. 
- `Test your connection`. Set `password` to `rootpassword`. If successfull, `connect`.     

The database is now fully operational and ready to handle CRUD operations from the backend.

#### Running the backend in Spring Boot
Prerequisites:
- Maven: https://maven.apache.org/download.cgi
- Java Development Kit 17 (JDK 17): https://www.oracle.com/fr/java/technologies/downloads/    

Ensure you have both their paths added to your PATH variables.
```
cd backend
# Build the JAR file if not available
mvn package 
# Run the JAR file
java -jar target/demo-0.0.1-SNAPSHOT.jar
```
The backend is now operational and ready to receive requests from the frontend.

#### Running the Fabric blockchain and Token SDK from Hyperledger
Prerequisites:
- Ubuntu 22.04.3 LTS
- golang 1.20+
- git
- docker v26.1.1
- docker-compose v2.27.0    

Start by cloning the project repository: https://github.com/hyperledger/fabric-samples.git and installing the dependencies: 
```
# From the fabric-samples directory
curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
./install-fabric.sh docker binary
# Make sure that the new binaries are in your PATH. If not, change the following line (replace <your/path/to/> with the actual path) and add it to your ~/.bashrc or ~/.zshrc file. Restart your terminal or source the edited file.
export PATH=</your/path/to/>fabric-samples/bin:$PATH
# Validate that the CA is at v1.5.7 by executing:
fabric-ca-client version
export TEST_NETWORK_HOME=</your/path/to>/fabric-samples/test-network
# Install go and tokengen. Tokengen is a tool to create the configuration file for the token chaincode.
sudo apt install golang
sudo apt-get install jq
go version
go install github.com/hyperledger-labs/fabric-token-sdk/cmd/tokengen@v0.3.0
```
Start the network. This generates the cryptogtaphic material, configures and starts the network, deploys the chaincode, and runs the token nodes.
```
./scripts/up.sh
```
By default, Alice and Bob are already enrolled. However, if you wish to enroll and register a new user, run:
```
fabric-ca-client register -u http://localhost:27054 --id.name newUser --id.secret password --id.type client --enrollment.type idemix --idemix.curve gurvy.Bn254
fabric-ca-client enroll -u http://newUser:password@localhost:27054 -M "$(pwd)/keys/owner1/wallet/newUser/msp" --enrollment.type idemix --idemix.curve gurvy.Bn254
```
To stop the network and delete everything, run:
```
./scripts/down.sh
```
The network and token SDKs are now operational and can handle requests from the frontend.

#### Running the Keycloak identity service provider
```
cd keycloak
# Build the docker image
docker build -t my-keycloak .
# Run the docker container
docker run -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin -p 8099:8080 my-keycloak
```
- Navigate to http://localhost:8099/admin and set the `username` and `password` to `admin`. You are now inside the service provider's admin console.
- Go to `Realm Settings` -> `User profile` -> `Create attribute`. Set `Attribute Name` to `Type` and `display name` to `${type}`. Select `Required field` and provide Permission to all. Create.
- Go to `Clients` -> `Create Client`. Set the `client ID` to `React-auth`. Go to `Next` and set `Root Url` to `http://localhost:3000/`.
- Go to `Client scopes` -> `Create client scope`. Select `profil` in the list Name -> `Mappers` -> `Add mapper by Configuration` -> `User Attribute`. Set `Name` to `Type`. Select `Type` in the User Attribute list, set `token claim Name` to `type` and finish by selecting `Add to lightweight access token`. Save.
- Go to `Users` -> `Create New User`. Select `Email verified` and set `Username` to `alice`, `Type` to `customer`, `Credentials` to `alice` and untick `Temporary`.
- Go to `Users` -> `Create New User`. Select `Email verified` and set `Username` to `bob`, `Type` to `customer`, `Credentials` to `bob` and untick `Temporary`.
- Go to `Users` -> `Create New User`. Select `Email verified` and set `Username` to `issuer`, `Type` to `supplier`, `Credentials` to `issuer` and untick `Temporary`.
- Go to `Realm Settings` -> `Themes` and set `Login Theme` to `themeLast2`. This theme was customized specifically for our application. If you wish to tailor it to your own needs, please use the Keycloakifier framework.
