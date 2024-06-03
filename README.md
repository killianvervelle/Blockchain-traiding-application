### Project description

This project merges blockchain technology, specifically Hyperledger Fabric and Fabric Token SDK, with Spring Boot, React, and MySQL. The application offers users the opportunity to seamlessly exchange their local currency for gold-backed tokens and conduct international settlements. By leveraging the transparency and security of blockchain, users can trust in the integrity of their transactions while benefiting from the stability of gold-backed assets. With a modular architecture encompassing frontend, backend, blockchain, and database layers, the application ensures a user-friendly experience while providing a reliable platform for currency trading and settlements.

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
Create a New Connection: In MySQL Workbench, go to the "Database" menu and select "Manage Connections." Click on the "New" button to create a new connection.
Enter Connection Details: Provide a random name for your connection. Set the username to "root". Change the port to 3307. Test connection. Set password to "rootpassword". If successfull, connect. The backend can now perform CRUD operations to the database.

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
- bash
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
# Validate that the CA is at v1.5.7 by executing ```fabric-ca-client version```.
export TEST_NETWORK_HOME=</your/path/to>/fabric-samples/test-network
# Install tokengen. Tokengen is a tool to create the configuration file for the token chaincode.
go install github.com/hyperledger-labs/fabric-token-sdk/cmd/tokengen@v0.3.0
```
Start the network. This generates the cryptogtaphic material, configures and starts the network, deploys the chaincode, and runs the token nodes.
```
./scripts/up.sh
```
Enroll and register the issuer, receiver and sender involved in our use case and registered in Keycloak's identity service provider.
```
fabric-ca-client register -u http://localhost:27054 --id.name sender --id.secret password --id.type client
fabric-ca-client enroll -u http://sender:password@localhost:27054 -M "$(pwd)/keys/sender/aud/msp"

fabric-ca-client register -u http://localhost:27054 --id.name receiver --id.secret password --id.type client
fabric-ca-client enroll -u http://receiver:password@localhost:27054 -M "$(pwd)/keys/receiver/aud/msp"

fabric-ca-client register -u http://localhost:27054 --id.name issuer --id.secret password --id.type client
fabric-ca-client enroll -u http://issuer:password@localhost:27054 -M "$(pwd)/keys/issuer/aud/msp"
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
docker run -e KEYCLOAK_ADMIN=admin -e KEYCLOAK_ADMIN_PASSWORD=admin -p 8096:8080 my-keycloak
```
- Navigate to http://localhost:8096/admin and set the username and password to `admin`. You are now inside the service provider's admin console.
- Go to ``Realm Settings`` -> ``User profile`` -> ``Create attribute``. Set Attribute Name to "Type" and display name to "${type}". Select "Required field" and provide Permission to all. Create.
- Click on , Create Client. Set the client ID to "React-auth". Next. Next. Set Root Url to "http://localhost:3000/".
- Click on Clients, Create Client. Set the client ID to "React-auth". Next. Next. Set Root Url to "http://localhost:3000/".
- Click on Client scopes, Create client scope. Select profil in the list Name, Mappers, Add mapper, by Configuration. Select User Attribute and set Name to "Type". Select "Type" in the User Attribute list, set token claim Name to "type" and finish by selecting "Add to lightweight access token". Save.
- Click on Users, Create New User. Select "Email verified". Set Username as "sender" and Type as "customer". Set Credentials to "sender" and untick "Temporary".
- Click on Users, Create New User. Select "Email verified". Set Username as "receiver" and Type as "customer". Set Credentials to "receiver" and untick "Temporary".
- Click on Users, Create New User. Select "Email verified". Set Username as "issuer" and Type as "supplier". Set Credentials to "issuer" and untick "Temporary".
- Go to Realm Settings, click on Themes and select as Login Theme "themeLast2". This theme was customized for our application.