import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:8085/auth',
    realm: 'Keycloak-react-auth',
    clientId: 'React-auth',
});

export default keycloak;