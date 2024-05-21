import { useKeycloak } from "@react-keycloak/web";

/**
 * PrivateRoute component serves as a wrapper for routes that require authentication.
 * It checks whether the user is authenticated using Keycloak and renders its children (the content of the route) if the user is logged in.
 * 
 * @param {object} props - The properties passed to the PrivateRoute component.
 * @param {JSX.Element} props.children - The children elements to be rendered if the user is authenticated.
 * @returns {JSX.Element|null} The rendered children if the user is authenticated, otherwise null.
 */

const PrivateRoute = ({ children }) => {
  const { keycloak } = useKeycloak();

  const isLoggedIn = keycloak.authenticated;

  return isLoggedIn ? children : null;
};

export default PrivateRoute;
