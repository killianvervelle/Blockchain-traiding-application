import Keycloak from "keycloak-js";

/**
 * Initializes a Keycloak instance with the provided configuration.
 */

const keycloak = new Keycloak({
  url: "http://localhost:8096/",
  realm: "Keycloak-react-auth",
  clientId: "React-auth",
});

export default keycloak;
