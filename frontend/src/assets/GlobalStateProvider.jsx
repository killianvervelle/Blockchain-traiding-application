import React, { createContext, useEffect, useState } from "react";
import { useKeycloak } from "@react-keycloak/web";
import FabricService from "../assets/FabricService";
import MarketDataService from "./MarketDataService";

export const GlobalStateContext = createContext();

export const GlobalStateProvider = ({ children }) => {
  const { keycloak, initialized } = useKeycloak();
  const [transactions, setTransactions] = useState([]);
  const [ fabricService, setFabricService] = useState([]);
  const [ marketDataService, setMarketDataService] = useState([]);


  useEffect(() => {
    async function fetchData() {
      if (initialized && keycloak.authenticated) {
        try {
          const fabricService = new FabricService(
            keycloak.tokenParsed.preferred_username
          );
          setFabricService(fabricService)
          const marketDataService = new MarketDataService()
          setMarketDataService(marketDataService)
          const transactionsData = await fabricService.GetAccountTransactions();
          setTransactions(transactionsData.payload || []);
        } catch (error) {
          console.log("Error fetching data:", error);
        }
      }
    }

    fetchData();
  }, [initialized, keycloak]);

  return (
    <GlobalStateContext.Provider value={{ transactions, keycloak, fabricService, marketDataService }}>
      {children}
    </GlobalStateContext.Provider>
  );
};
