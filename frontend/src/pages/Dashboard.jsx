import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useGlobalState } from "../assets/ContextHook";

import Metrics from "../assets/Metrics";
import Downloader from "../helpers/Downloader";

/**
 * Dashboard component displays user-related statistics and visualizations based on transaction data, account balances, gold prices, and exchange rates.
 * It fetches data from fabricService and marketDataService and renders various statistics and visualizations based on this data.
 */

const Dashboard = () => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { fabricService, marketDataService, requestService } = useGlobalState();
  const { keycloak } = useKeycloak();
  const [transactions, setTransactions] = useState([]);
  const [issuanceRequestsByIssuer, setIssuanceRequestsByIssuer] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [rates, setRates] = useState({});
  const [currency, setCurrency] = useState(null);
  const [balances, setBalances] = useState([]);
  const [goldprice, setgoldprice] = useState([]);
  const chartRef1 = useRef(null);
  const chartRef3 = useRef(null);
  const downloader = new Downloader();

  useEffect(() => {
    const fetchAndProcessData = async () => {
      if (fabricService && marketDataService) {
        try {
          let newTransactions = [];
          let newBalances = [];
          let newIssuanceRequests = [];

          // Fetching user geolocation
          const userGeolocation = await marketDataService.user_geolocalization();

          // Retrieving user geolocation
          const userLocalCurrency = userGeolocation.country.currency.split(",");

          // Fetching gold price
          // const goldPrice = await marketDataService.fetchGoldPrice(userLocalCurrency);
          // setgoldprice(goldPrice.price_gram_24k || []);
          setgoldprice("86.89");

          // Fetching exchange rates
          const ratesData = await marketDataService.fetchExchangeRates(
            userLocalCurrency);
          setRates(ratesData.rates || {});
          setCurrency(ratesData.base || null);

          await keycloak.loadUserProfile();

          if (keycloak.tokenParsed["type"] === "customer") {
            // Fetching account transactions
            const transactionsData = await fabricService.getAccountTransactions();
            newTransactions = transactionsData.payload || [];
            setTransactions(newTransactions);
            const newMetrics = new Metrics(newTransactions, keycloak.tokenParsed.preferred_username);
            setMetrics(newMetrics);
            // Fetching account balances
            const balancesData = await fabricService.getAccountBalances();
            if (balancesData.payload.balance) {
              newBalances = balancesData.payload.balance[0] || [];
              setBalances(newBalances);
            } else {
              console.warn("Balances data structure is not as expected:", balancesData);
            }
          }

          if (keycloak.tokenParsed["type"] === "supplier") {
            try {
              const requestsByIssuer = await requestService.getAllIssuanceRequestByIssuer(keycloak.tokenParsed.preferred_username);
              setIssuanceRequestsByIssuer(requestsByIssuer || []);
              
            } catch (error) {
              console.error("Failed to fetch user request logs.", error);
            }
          }

          if (chartRef3.current) {
            // Generating gold price graph
            marketDataService.generateGoldPriceGraph(chartRef3.current);
          }

        } catch (error) {
          console.error("Failed to fetch and process user data:", error);
        }

      }
    };

    fetchAndProcessData();
  }, [fabricService, marketDataService, keycloak, requestService]);

  useEffect(() => {
    if (transactions.length && metrics)
        if (chartRef1.current) {
          metrics.generateTransactionsGraph(chartRef1.current);
        }
      }, [transactions, metrics]);

  useEffect(() => {
    if ((transactions.length && metrics) || (issuanceRequestsByIssuer.length && requestService)) {
      setIsLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);


  if (isLoading) {
    console.log("Data loading...");
    return <div>Loading...</div>;
  } else {
    return (
      <div className="container-fluid">
        <br />
        <div className="d-sm-flex align-items-center justify-content-between mb-4">
          <h2 className="h3 mb-0 text-gray-800"> </h2>
          <button
            className="btn btn-primary mt-1"
            onClick={() =>
              downloader.handleAllDownload(transactions, goldprice, rates)
            }>Dowload Report</button>
        </div>
        <div className="row">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-primary shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Total transactions
                    </div>
                    {keycloak.tokenParsed["type"] === "customer" && (
                      <>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {metrics.countTotalTransactions()}
                        </div>
                      </>
                    )}
                    {keycloak.tokenParsed["type"] === "supplier" && (
                      <>
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {issuanceRequestsByIssuer.length}
                        </div>
                      </>
                    )}
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Pending Transactions
                    </div>
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto">
                        {keycloak.tokenParsed["type"] === "customer" && (
                          <>
                            {metrics && (
                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                              {metrics.countPendingTransactions()}
                            </div>
                          )}
                                                    </>
                        )}
                        {keycloak.tokenParsed["type"] === "supplier" && (
                          <>
                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                              0
                            </div>
                          </>
                        )}
                      </div>
                      <div className="col">
                        <div className="progress progress-sm mr-2">
                          <div
                            className="progress-bar bg-info"
                            role="progressbar"
                            aria-valuenow={0}
                            aria-valuemin={0}
                            aria-valuemax={100}
                            style={{
                              width: `${(metrics.countPendingTransactions() /
                                metrics.countTotalTransactions()) *
                                100
                                }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-info shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      {balances.code} balance
                    </div>
                    <div className="row no-gutters align-items-center">
                      <div className="col-auto">
                        {keycloak.tokenParsed["type"] === "customer" && (
                          <>
                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                              {balances.value}
                            </div>
                          </>
                        )}
                        {keycloak.tokenParsed["type"] === "supplier" && (
                          <>
                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                              {10000}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="fas fa-clipboard-list fa-2x text-gray-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-left-success shadow h-100 py-2">
              <div className="card-body">
                <div className="row no-gutters align-items-center">
                  <div className="col mr-2">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Current Gold price {currency}
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {goldprice}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                  Monthly Transactions
                </h6>
                <div className="dropdown no-arrow">
                  <a
                    className="dropdown-toggle"
                    href="#"
                    role="button"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <a className="dropdown-item" href="#">
                      {keycloak.tokenParsed["type"] === "customer" && (
                        <>
                          <button
                            className="btn btn-primary mt-3"
                            onClick={() => downloader.handleDownload(transactions, "transactions.json")}
                          >
                            Download data
                          </button>
                        </>
                      )}
                      {keycloak.tokenParsed["type"] === "supplier" && (
                        <>
                          <button
                            className="btn btn-primary mt-3"
                            onClick={() =>
                              downloader.handleDownload(issuanceRequestsByIssuer, "issuanceRequests.json")
                            }
                          >
                            Download data
                          </button>
                        </>
                      )}
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ maxHeight: "320px" }}>
                <div
                  className="chart-area"
                  style={{ width: "100%", height: "auto" }}
                >
                  <canvas id="myAreaChart1" ref={chartRef1} />
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                  Gold price 1 month
                </h6>
                <div className="dropdown no-arrow">
                  <a
                    className="dropdown-toggle"
                    href="#"
                    role="button"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <div className="dropdown-header">Dropdown Header:</div>
                    <a className="dropdown-item" href="#">
                      <button
                        className="btn btn-primary mt-3"
                        onClick={() => downloader.handleDownload(goldprice, "goldPrices.json")}
                      >
                        Download data
                      </button>
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ maxHeight: "320px" }}>
                <div
                  className="chart-area"
                  style={{ width: "100%", height: "auto" }}
                >
                  <canvas id="myAreaChart3" ref={chartRef3} />
                </div>
              </div>
            </div>
          </div>
          <div className="col">
            <div className="card shadow mb-4">
              <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                <h6 className="m-0 font-weight-bold text-primary">
                  Exchange rates for 1 {currency}
                </h6>
                <div className="dropdown no-arrow">
                  <a
                    className="dropdown-toggle"
                    href="#"
                    role="button"
                    id="dropdownMenuLink"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fas fa-ellipsis-v fa-sm fa-fw text-gray-400" />
                  </a>
                  <div
                    className="dropdown-menu dropdown-menu-right shadow animated--fade-in"
                    aria-labelledby="dropdownMenuLink"
                  >
                    <div className="dropdown-header">Dropdown Header:</div>
                    <a className="dropdown-item" href="#">
                      <button
                        className="btn btn-primary mt-3"
                        onClick={() => downloader.handleDownload(rates, "exchangeRates.json")}
                      >
                        Download data
                      </button>
                    </a>
                  </div>
                </div>
              </div>
              <div className="card-body" style={{ maxHeight: "320px" }}>
                <div className="container-table3">
                  <div class="table-section3" style={{ width: "90%" }}>
                    <div id="table-wrapper3">
                      <div id="table-scroll3" style={{ maxHeight: "210px" }}>
                        <div className="content-table">
                          <table id="table_rates">
                            <thead>
                              <tr>
                                <th>Currency</th>
                                <th>Rate</th>
                                <th>Token value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(rates).map(
                                ([currency, rate], index) => (
                                  <tr key={index}>
                                    <td>{currency}</td>
                                    <td>{rate}</td>
                                    <td>{(rate * goldprice).toFixed(2)}</td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};


export default Dashboard;
