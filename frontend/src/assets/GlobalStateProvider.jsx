import React, { createContext, useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";

import FabricService from "../assets/FabricService";
import MarketDataService from "./MarketDataService";
import RequestService from "./RequestService";
import Metrics from "./Metrics";

/**
 * GlobalStateContext provides a context for the global state of the application.
 */

export const GlobalStateContext = createContext();

/**
 * GlobalStateProvider component is responsible for managing and providing the global state.
 * It initializes services upon authentication.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components that will consume the global state.
 * @returns {JSX.Element} The GlobalStateContext.Provider component with the global state.
 */

export const GlobalStateProvider = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  const [fabricService, setFabricService] = useState([]);
  const [marketDataService, setMarketDataService] = useState([]);
  const [requestService, setRequestService] = useState([]);
  const [metricsService, setMetricsService] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (initialized && keycloak.authenticated) {
        try {
          const fabricService = new FabricService(
            keycloak.tokenParsed.preferred_username
          );
          setFabricService(fabricService);
          const marketDataService = new MarketDataService();
          setMarketDataService(marketDataService);
          const requestService = new RequestService(fabricService);
          setRequestService(requestService)
          const metricService = new Metrics(
            keycloak.tokenParsed.preferred_username
          );
          setMetricsService(metricService)
        } catch (error) {
          console.log(error);
        }
      }
    }

    fetchData();
  }, [initialized, keycloak]);

  return (
    <GlobalStateContext.Provider
      value={{ fabricService, marketDataService, requestService, metricsService }}
    >
      {children}
    </GlobalStateContext.Provider>
  );
};
