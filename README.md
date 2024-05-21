### E-SIGNATURE project

To integrate React with Spring Boot, we created CRUD (Create, Read, Update, Delete) app. This involved setting up a data model in your Spring Boot application, creating a repository class to handle database operations, and building a REST API to expose CRUD operations.

#### Running the frontend (React)

```
cd frontend  
npm install
npm start   
```

#### Running the backend (Springboot)
```
cd backend
mvn clean packages
cd target
java -jar project-0.0.1-SNAPSHOT.jar
```

#### Frontend structure

The folder has several components and pages, making the code modulable and reusable. The components are rendered at each page load. In the App.jss, the content is wrapped inside <Router> which containes <Routes>. Each Route refers to a path and renders a specific page. 

#### Docker
```
docker run -v ./keycloak_data:/opt/jboss/keycloak/standalone/data/ -p 8080:8080  -e KEYCLOAK_USER=admin -e KEYCLOAK_PASSWORD=admin --name my_keycloak quay.io/keycloak/keycloak:15.0.2
```

#### FE

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.