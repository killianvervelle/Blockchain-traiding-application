import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useGlobalState } from "../assets/ContextHook";
import Metrics from "../assets/Metrics";

const Dashboard = () => {
  const { pathname } = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { keycloak, fabricService, marketDataService } = useGlobalState();
  const [transactions, setTransactions] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [rates, setRates] = useState({});
  const [balances, setBalances] = useState([]);
  const [goldprice, setgoldprice] = useState(null);
  const chartRef1 = useRef(null);
  const chartRef3 = useRef(null);

  const handleDownload = (data) => {
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { type: "text/plain" });
    const a = document.createElement("a");
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = "data.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const fetchdata = async () => {
      if (fabricService && marketDataService) {
        try {
          const transactionsData = await fabricService.GetAccountTransactions();
          setTransactions(transactionsData.payload || []);
          //const goldPrice = await marketDataService.fetchGoldPrice();
          //setgoldprice(goldPrice.price_gram_24k || []);
          setgoldprice("77.7328" || []);
          const balancesData = await fabricService.GetAccountBalances();
          setBalances(balancesData.payload.balance[0] || []);
          const ratesData = await marketDataService.fetchExchangeRates();
          setRates(ratesData.rates || []);
          if (chartRef3.current) {
            marketDataService.generateGoldPriceGraph(chartRef3.current);
          }
        } catch (error) {
          console.error("Failed to fetch balances:", error);
        }
      }
    };

    fetchdata();
  }, [fabricService, marketDataService]);

  useEffect(() => {
    if (transactions) {
      setIsLoading(false);
      const metrics = new Metrics(
        transactions,
        keycloak.tokenParsed.preferred_username
      );
      setMetrics(metrics);
      if (chartRef1.current) {
        metrics.generateTransactionsGraph(chartRef1.current);
      }
    }
  }, [transactions]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  if (isLoading) {
    console.log("Data loading...");
    return <div>Loading...</div>;
  }

  return (
    <div className="container-fluid">
      <br />
      <div className="d-sm-flex align-items-center justify-content-between mb-4">
        <h1 className="h3 mb-0 text-gray-800">Dashboard</h1>
        <a
          href="#"
          className="d-none d-sm-inline-block btn btn-sm btn-primary shadow-sm"
        >
          <i className="fas fa-download fa-sm text-white-50" /> Generate Report
        </a>
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
                  <div className="h5 mb-0 font-weight-bold text-gray-800">
                    {metrics.countTotalTransactions()}
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
                    Pending Transactions
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                        {metrics.countPendingTransactions()}
                      </div>
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
                            width: `${
                              (metrics.countPendingTransactions() /
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
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                        {balances.value}
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
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Current Gold price (USD)
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
                    <button
                      className="btn btn-primary mt-3"
                      onClick={() => handleDownload(transactions)}
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
                <canvas id="myAreaChart1" ref={chartRef1} />
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="card shadow mb-4">
            <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
              <h6 className="m-0 font-weight-bold text-primary">
                Gold price chart 1M (USD)
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
                      onClick={() => handleDownload(goldprice)}
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
                Exchange rates
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
                      onClick={() => handleDownload(rates)}
                    >
                      Download data
                    </button>
                  </a>
                </div>
              </div>
            </div>
            <div className="card-body" style={{ maxHeight: "320px" }}>
              <div className="container-table2">
                <div class="table-section">
                  <div id="table-wrapper">
                    <div id="table-scroll">
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
};

export default Dashboard;
