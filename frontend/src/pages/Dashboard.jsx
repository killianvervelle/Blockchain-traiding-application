import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useGlobalState } from "../assets/ContextHook";

import Metrics from "../assets/Metrics";

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
  const [userLocalization, setUserLocalization] = useState([]);
  const chartRef1 = useRef(null);
  const chartRef3 = useRef(null);

  const handleDownload = (data) => {
    const jsonData = JSON.stringify(data);
    const blob = new Blob([jsonData], { Type: "text/plain" });
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
          if (keycloak.tokenParsed["Type"] === "Customer") {
            console.log("Fetching account transactions...");
            const transactionsData =
              await fabricService.getAccountTransactions();
            console.log("Successfully fetched user's transactions.");
            setTransactions(transactionsData.payload || []);

            console.log("Fetching account balances...");
            const balancesData = await fabricService.getAccountBalances();
            console.log("Successfully fetched user's balances.");
            if (balancesData.payload.balance) {
              setBalances(balancesData.payload.balance[0] || []);
            } else {
              console.warn(
                "Balances data structure is not as expected:",
                balancesData
              );
            }
          }

          if (keycloak.tokenParsed["Type"] === "Supplier") {
            try {
              const requestsByIssuer =
                await requestService.getAllIssuanceRequestByIssuer(
                  keycloak.tokenParsed.preferred_username
                );
              setIssuanceRequestsByIssuer(requestsByIssuer || []);
              console.log("REWQUESTS", requestsByIssuer);
            } catch (error) {
              console.error("Failed to fetch user request logs.", error);
            }
          }

          console.log("Fetching user geolocalization...");
          const user_geolocalization =
            await marketDataService.user_geolocalization();
          console.log("Fetched user geolocalization:", user_geolocalization);
          setUserLocalization(user_geolocalization.country.currency.split(","));
        } catch (error) {
          console.error("Failed to fetch data:", error);
        }
      }
    };

    fetchdata();
  }, [fabricService, marketDataService]);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (marketDataService && userLocalization) {
        try {
          console.log("Fetching gold price...");
          //const goldPrice = await marketDataService.fetchGoldPrice(
          //  userLocalization
          //);
          //console.log("Fetched gold price:", goldPrice);
          //setgoldprice(goldPrice.price_gram_24k || []);
          setgoldprice("68.8944" || []);
          console.log("Fetching exchange rates...");
          const rates = {
            AED: 3.9846884699,
            AFN: 77.8239141496,
            ALL: 100.3534670082,
            AMD: 420.0052474048,
            ANG: 1.9528948599,
            AOA: 920.3397317607,
            ARS: 964.6545977442,
            AUD: 1.6367760282,
            AZN: 1.8485466848,
            BAM: 1.954893148,
            BBD: 2.1878857309,
            BDT: 127.1010643434,
            BGN: 1.9586369549,
            BHD: 0.4087106702,
            BIF: 3110.3577543234,
            BND: 1.4631211698,
            BOB: 7.4875280569,
            BRL: 5.6056255824,
            BSD: 1.0835972224,
            BTC: 0.0000156759,
            BTN: 90.0630382875,
            BYN: 3.5461553566,
            BZD: 2.1841874876,
            CAD: 1.4831485297,
            CDF: 3048.4203673509,
            CHF: 1,
            CLF: 0.0357294348,
            CLP: 985.89285075,
            CNY: 7.856506207,
            COP: 4192.6559028151,
            CRC: 555.5423996164,
            CVE: 110.2138949369,
            CZK: 24.6394825714,
            DJF: 192.9305394185,
            DKK: 7.4666805527,
            DOP: 63.8104121442,
            DZD: 145.7854009974,
            EGP: 51.1232950274,
            ERN: 16.2727044909,
            ETB: 62.2599304179,
            ETH: 0.0002893411,
            EUR: 1.0001308816,
            FJD: 2.4600532226,
            FKP: 0.8636455848,
            GBP: 0.8517655763,
            GEL: 2.9403594532,
            GHS: 15.765689328,
            GIP: 0.8636455848,
            GMD: 73.5217028224,
            GNF: 9314.6808651438,
            GTQ: 8.4170965373,
            GYD: 226.7048793162,
            HKD: 8.473852476,
            HNL: 26.7775835902,
            HRK: 7.5721840899,
            HTG: 144.0631988449,
            HUF: 384.1013377248,
            IDR: 17406.3695704765,
            ILS: 3.9697208363,
            INR: 90.1060329425,
            IQD: 1419.4418169451,
            IRR: 45644.9362880225,
            ISK: 149.9299883162,
            JMD: 169.5813662346,
            JOD: 0.7690523536,
            JPY: 170.2721989523,
            KES: 141.4044320338,
            KGS: 95.4184764626,
            KHR: 4419.9505081966,
            KMF: 494.3107283771,
            KRW: 1482.6644590031,
            KWD: 0.3330588671,
            KYD: 0.902981051,
            KZT: 479.9274617076,
            LAK: 23192.2459608435,
            LBP: 97034.306050517,
            LKR: 324.5994864334,
            LRD: 209.9992937646,
            LSL: 20.0477561824,
            LYD: 5.2505649341,
            MAD: 10.8084887105,
            MDL: 19.2230868453,
            MGA: 4801.7734600869,
            MKD: 61.5914401235,
            MMK: 2275.5448502857,
            MNT: 3742.7217866562,
            MOP: 8.7199565193,
            MRO: 215.1196358386,
            MUR: 49.966830804,
            MVR: 16.7721441675,
            MWK: 1878.7288500948,
            MXN: 18.1167317032,
            MYR: 5.1112586503,
            MZN: 68.8918277393,
            NAD: 20.0481764265,
            NGN: 1593.0545802781,
            NIO: 39.8815075901,
            NOK: 11.4807835633,
            NPR: 144.1011815068,
            NZD: 1.7723796177,
            OMR: 0.4173069976,
            PAB: 1.0835972224,
            PEN: 4.0509216317,
            PHP: 63.1429774059,
            PKR: 301.4394248575,
            PLN: 4.2616759367,
            PYG: 8150.2208151757,
            QAR: 3.9504745663,
            RON: 4.9753294951,
            RSD: 117.0926047067,
            RUB: 99.3991444897,
            RWF: 1424.9392680971,
            SAR: 4.0679624079,
            SCR: 14.8141369663,
            SDG: 651.9933943668,
            SEK: 11.7863741051,
            SGD: 1.4646562283,
            SLL: 22748.6994746086,
            SOS: 619.4707823789,
            SRD: 35.0128977456,
            STN: 24.5188452954,
            SVC: 9.4816037076,
            SZL: 19.9217619217,
            THB: 39.7520886016,
            TJS: 11.6809833921,
            TMT: 3.8078128509,
            TND: 3.3833664754,
            TOP: 2.5654504447,
            TRY: 34.9300154374,
            TTD: 7.3585874859,
            TWD: 34.9825220305,
            TZS: 2817.2936463768,
            UAH: 43.4928329585,
            UGX: 4123.0881600887,
            USD: 1.0848469661,
            UYU: 41.7006636009,
            UZS: 13775.612370076,
            VES: 39.5977197602,
            VND: 27632.1370725839,
            VUV: 128.7951906564,
            XAF: 655.6529791525,
            XAG: 0.0357371194,
            XAU: 0.0004647069,
            XCD: 2.9318531681,
            XOF: 655.6529791525,
            XPD: 0.0011234582,
            XPF: 120.0945080707,
            XPT: 0.0010906923,
            XRP: 2.003696842,
            YER: 271.5918317533,
            ZAR: 19.9822952975,
            ZMK: 9764.9284022699,
            ZMW: 28.9205902869,
          };
          //const ratesData = await marketDataService.fetchExchangeRates(
          //userLocalization
          //);
          //console.log("Fetched exchange rates:", ratesData);
          //setRates(ratesData.rates || {});
          setRates(rates || {});
          setCurrency("CHF" || null);
          //setCurrency(ratesData.base || null);

          if (chartRef3.current) {
            console.log("Generating gold price graph...");
            marketDataService.generateGoldPriceGraph(chartRef3.current);
          }
        } catch (error) {
          console.error("Failed to fetch additional data:", error);
        }
      }
    };

    fetchAdditionalData();
  }, [userLocalization, marketDataService]);

  useEffect(() => {
    const metrics = new Metrics(
      transactions,
      keycloak.tokenParsed.preferred_username
    );
    setMetrics(metrics);
    keycloak
      .loadUserProfile()
      .then((userInfo) => {})
      .catch((err) => {
        console.error("Failed to load user info", err);
      });
    if (transactions && keycloak.tokenParsed["Type"] === "Customer") {
      setIsLoading(false);
      if (chartRef1.current) {
        metrics.generateTransactionsGraph(chartRef1.current);
      }
    }
    if (
      issuanceRequestsByIssuer &&
      keycloak.tokenParsed["Type"] === "Supplier"
    ) {
      setIsLoading(false);
      if (chartRef1.current) {
        requestService.generateFulfilledRequetsGraph(
          chartRef1.current,
          issuanceRequestsByIssuer
        );
      }
    }
  }, [transactions, issuanceRequestsByIssuer]);

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
                  {keycloak.tokenParsed["Type"] === "Customer" && (
                    <>
                      <div className="h5 mb-0 font-weight-bold text-gray-800">
                        {metrics.countTotalTransactions()}
                      </div>
                    </>
                  )}
                  {keycloak.tokenParsed["Type"] === "Supplier" && (
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
                      {keycloak.tokenParsed["Type"] === "Customer" && (
                        <>
                          <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                            {metrics.countPendingTransactions()}
                          </div>
                        </>
                      )}
                      {keycloak.tokenParsed["Type"] === "Supplier" && (
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
                      {keycloak.tokenParsed["Type"] === "Customer" && (
                        <>
                          <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                            {balances.value}
                          </div>
                        </>
                      )}
                      {keycloak.tokenParsed["Type"] === "Supplier" && (
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
                    {keycloak.tokenParsed["Type"] === "Customer" && (
                      <>
                        <button
                          className="btn btn-primary mt-3"
                          onClick={() => handleDownload(transactions)}
                        >
                          Download data
                        </button>
                      </>
                    )}
                    {keycloak.tokenParsed["Type"] === "Supplier" && (
                      <>
                        <button
                          className="btn btn-primary mt-3"
                          onClick={() =>
                            handleDownload(issuanceRequestsByIssuer)
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
                      onClick={() => handleDownload(rates)}
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
                    <div id="table-scroll3" style={{ maxHeight: "280px" }}>
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
