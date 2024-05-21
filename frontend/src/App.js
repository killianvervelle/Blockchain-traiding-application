import "../src/App.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { ReactKeycloakProvider } from "@react-keycloak/web";

import Navigation from "./components/Navigation";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import RequestHandler from "./pages/RequestHandler";
import Topbar from "./components/Topbar";
import keycloak from "./assets/KeyCloakClient";
import PrivateRoute from "./helpers/PrivateRoute";
import { GlobalStateProvider } from "./assets/GlobalStateProvider";
import PageNotFound from "./helpers/PageNotFound";

function App() {
  return (
    <div className="App">
      <ReactKeycloakProvider authClient={keycloak}>
        <GlobalStateProvider>
          <Header />
          <Router>
            <div className="side-by-side">
              <Navigation />
              <div className="top-by-top">
                <div className="topbar">
                  <Topbar />
                </div>
                <Routes>
                  <Route
                    path="/"
                    element={<Navigate to="/dashboard"> </Navigate>}
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <PrivateRoute>
                        <Dashboard />{" "}
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/request-handler"
                    exact
                    element={
                      <PrivateRoute>
                        <RequestHandler />
                      </PrivateRoute>
                    }
                  />
                  <Route path="*" element={<PageNotFound />} />
                </Routes>
              </div>
            </div>
          </Router>
        </GlobalStateProvider>
      </ReactKeycloakProvider>
    </div>
  );
}

export default App;
