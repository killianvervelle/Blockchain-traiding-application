import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useGlobalState } from "../assets/ContextHook";

import Downloader from "../helpers/Downloader";

/**
 * Dashboard component displays user-related statistics and visualizations based on transaction data, account balances, gold prices, and exchange rates.
 * It fetches data from fabricService and marketDataService and renders various statistics and visualizations based on this data.
 */

const Dashboard = () => {
  const { pathname } = useLocation();
  const { fabricService, marketDataService, requestService, metricsService } = useGlobalState();
  const { keycloak } = useKeycloak();
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({
    transactions: [],
    issuanceRequests: [],
    rates: {},
    currency: null,
    balances: [],
    goldprice: [],
  });
  const chartRefs = {
    transactions: useRef(),
    issuanceRequests: useRef(),
    goldPrice: useRef(),
  };
  const downloader = new Downloader();

  useEffect(() => {
    const fetchData = async () => {
      if (!fabricService || !marketDataService || !requestService) return;
      try {
        const userGeolocation = await marketDataService.user_geolocalization();
        const userLocalCurrency = userGeolocation.country.currency.split(",");
        const ratesData = {
          "success": true,
          "timestamp": 1717664576,
          "base": "CHF",
          "rates": {
            "EUR": 1.0312,
            "GDP": 0.8775,
            "JPY": 174.9996,
            "AUD": 1.6874,
            "CAD": 1.5357,
            "CNY": 8.1276,
            "HKD": 8.7616
          }
        }
        setData((prevData) => ({
          ...prevData,
          rates: ratesData.rates || {},
          currency: ratesData.base || null,
        }));

        if (keycloak.tokenParsed["type"] === "customer") {
          const transactionsData = await fabricService.getAccountTransactions();
          const balancesData = await fabricService.getAccountBalances();
          setData((prevData) => ({
            ...prevData,
            transactions: transactionsData.payload || [],
            balances: balancesData.payload.balance?.[0] || [],
          }));
        }

        if (keycloak.tokenParsed["type"] === "supplier") {
          const requestsByIssuer = await requestService.getAllIssuanceRequestByIssuer(keycloak.tokenParsed.preferred_username);
          setData((prevData) => ({
            ...prevData,
            issuanceRequests: requestsByIssuer || [],
          }));
        }

      } catch (error) {
        console.error("Failed to fetch and process user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isLoading]);

  useEffect(() => {
    if (data.transactions.length && metricsService && chartRefs.transactions.current) {
      if (chartRefs.transactions.current.chartInstance) {
        chartRefs.transactions.current.chartInstance.destroy();
      }
      metricsService.generateTransactionsGraph(chartRefs.transactions.current, data.transactions);
    }
  }, [data.transactions, isLoading]);

  useEffect(() => {
    if (data.issuanceRequests.length && requestService && chartRefs.issuanceRequests.current) {
      if (chartRefs.issuanceRequests.current.chartInstance) {
        chartRefs.issuanceRequests.current.chartInstance.destroy();
      }
      requestService.generateFulfilledRequetsGraph(chartRefs.issuanceRequests.current, data.issuanceRequests);
    }
  }, [data.issuanceRequests, isLoading]);

  useEffect(() => {
    if (marketDataService && chartRefs.goldPrice.current) {
      if (chartRefs.goldPrice.current.chartInstance) {
        chartRefs.goldPrice.current.chartInstance.destroy();
      }
      marketDataService.generateGoldPriceGraph(chartRefs.goldPrice.current);
    }
  }, [isLoading]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <br />
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h2 className="h3 mb-0 text-gray-800"> </h2>
        <button
          className="btn btn-primary mt-1"
          onClick={() =>
            downloader.handleAllDownload(data.transactions, data.goldprice, data.rates)
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
                      {metricsService && (
                        <div className="h5 mb-0 font-weight-bold text-gray-800">
                          {metricsService.countTotalTransactions(data.transactions)}
                        </div>
                      )}
                    </>
                  )}
                  {keycloak.tokenParsed["type"] === "supplier" && (
                    <>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {data.issuanceRequests.length}
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
                          {metricsService && (
                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                              {metricsService.countPendingTransactions(data.transactions)}
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
                          aria-valuenow={
                            metricsService
                              ? (metricsService.countPendingTransactions(data.transactions) /
                                metricsService.countTotalTransactions(data.transactions)) *
                              100
                              : 0
                          }
                          aria-valuemin={0}
                          aria-valuemax={100}
                          style={{
                            width: metricsService
                              ? `${(metricsService.countPendingTransactions() /
                                metricsService.countTotalTransactions()) *
                              100}%`
                              : "0%",
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
                    {data.balances.code} balance
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      {keycloak.tokenParsed["type"] === "customer" && (
                        <>
                          <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                            {data.balances.value}
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
                    Current Gold price {data.currency}
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {data.goldprice}
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
                          onClick={() => downloader.handleDownload(data.transactions, "transactions.json")}
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
                            downloader.handleDownload(data.issuanceRequests, "issuanceRequests.json")
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
            {keycloak.tokenParsed["type"] === "customer" && (
              <>
                <div className="card-body" style={{ maxHeight: "320px" }}>
                  <div
                    className="chart-area"
                    style={{ width: "100%", height: "auto" }}
                  >
                    <canvas id="myAreaChart1" ref={chartRefs.transactions} />
                  </div>
                </div>
              </>)}
            {keycloak.tokenParsed["type"] === "supplier" && (
              <>
                <div className="card-body" style={{ maxHeight: "320px" }}>
                  <div
                    className="chart-area"
                    style={{ width: "100%", height: "auto" }}
                  >
                    <canvas id="myAreaChart1" ref={chartRefs.issuanceRequests} />
                  </div>
                </div>
              </>)}
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
                      onClick={() => downloader.handleDownload(data.goldprice, "goldPrices.json")}
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
                <canvas id="myAreaChart3" ref={chartRefs.goldPrice} />
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Exchange rates for 1 {data.currency}
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
                      onClick={() => downloader.handleDownload(data.rates, "exchangeRates.json")}
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
                            {Object.entries(data.rates).map(
                              ([currency, rate], index) => (
                                <tr key={index}>
                                  <td>{currency}</td>
                                  <td>{rate}</td>
                                  <td>{(rate * data.goldprice).toFixed(2)}</td>
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
};


export default Dashboard;
