import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import { useGlobalState } from "../assets/ContextHook";

/**
 * RequestHandler component enables methods to interact with the blockchain such as issue, transfer and redeem tokens.
 */

const RequestHandler = () => {
  const [transactions, setTransactions] = useState([]);
  const [issuanceRequests, setIssuanceRequests] = useState([]);
  const [issuanceRequestsByIssuer, setIssuanceRequestsByIssuer] = useState([]);
  const { fabricService, requestService } = useGlobalState();
  const { keycloak } = useKeycloak();
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchdata = async () => {
      if (keycloak.tokenParsed["type"] === "customer") {
        try {
          const transactionsData = await fabricService.getAccountTransactions();
          setTransactions(transactionsData.payload || []);
        } catch (error) {
          console.error("Failed to fetch user transaction logs.", error);
        }
      }
      if (keycloak.tokenParsed["type"] === "supplier") {
        try {
          const requests = await requestService.getAllIssuanceRequest();
          setIssuanceRequests(requests || []);
          const requestsByIssuer =
            await requestService.getAllIssuanceRequestByIssuer(
              keycloak.tokenParsed.preferred_username
            );
          setIssuanceRequestsByIssuer(requestsByIssuer || []);
        } catch (error) {
          console.error("Failed to fetch user request logs.", error);
        }
      }
    };

    fetchdata();
  }, [keycloak, requestService, fabricService]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div className="container-fluid">
      <div class="content">
        {keycloak.tokenParsed["type"] === "customer" && (
          <>
            <div class="content-t">
              <div className="row2">
                <div class="col transaction-section2">
                  <h6>Issuance Request</h6>
                  <div class="input-box">
                    <span class="details">Amount</span>
                    <input
                      type="number"
                      id="issued-amount"
                      placeholder="Enter amount"
                      required
                    ></input>
                  </div>
                  <div class="input-box">
                    <span class="details">Token Code</span>
                    <input
                      type="text"
                      id="issued-code"
                      placeholder="Enter token code"
                      required
                    ></input>
                  </div>
                  <div className="button">
                    <input
                      type="submit"
                      value="Send"
                      onClick={() => {
                        requestService.tokenIssuanceRequest(
                          document.getElementById("issued-code").value,
                          document.getElementById("issued-amount").value,
                          keycloak.tokenParsed.preferred_username
                        );
                        document.getElementById("issued-code").value = "";
                        document.getElementById("issued-amount").value = "";
                      }}
                    />
                  </div>
                </div>
                <div class="col transaction-section2">
                  <h6>Redeem Tokens</h6>
                  <div class="input-box">
                    <span class="details">Amount</span>
                    <input
                      type="text"
                      id="redeemed-amount"
                      placeholder="Enter amount"
                      required
                    ></input>
                  </div>
                  <div class="input-box">
                    <span class="details">Token Code</span>
                    <input
                      type="text"
                      id="redeemed-code"
                      placeholder="Enter token code"
                      required
                    ></input>
                  </div>
                  <div class="button">
                    <input
                      type="submit"
                      value="Redeem"
                      onClick={() => {
                        requestService.tokenRedemption(
                          document.getElementById("redeemed-code").value,
                          document.getElementById("redeemed-amount").value
                        );
                        document.getElementById("redeemed-code").value = "";
                        document.getElementById("redeemed-amount").value = "";
                      }}
                    />
                  </div>
                </div>
                <div class="col transaction-section2">
                  <h6>Transfer Tokens</h6>
                  <div class="input-box">
                    <span class="details">Amount</span>
                    <input
                      type="text"
                      id="transfered-amount"
                      placeholder="Enter amount"
                      required
                    ></input>
                  </div>
                  <div class="input-box">
                    <span class="details">Token Code</span>
                    <input
                      type="text"
                      id="transfered-code"
                      placeholder="Enter token code"
                      required
                    ></input>
                  </div>
                  <div class="input-box">
                    <span class="details">Recipient Account</span>
                    <input
                      type="text"
                      id="transfered-account"
                      placeholder="Enter recipient account"
                      required
                    ></input>
                  </div>
                  <div class="button">
                    <input
                      type="submit"
                      value="Transfer"
                      onClick={() => {
                        requestService.tokenTransfer(
                          document.getElementById("transfered-code").value,
                          document.getElementById("transfered-amount").value,
                          document.getElementById("transfered-account").value
                        );
                        document.getElementById("transfered-code").value = "";
                        document.getElementById("transfered-amount").value = "";
                        document.getElementById("transfered-account").value =
                          "";
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="col2">
                <div class="content2">
                  <h6>
                    Requests From {keycloak.tokenParsed.preferred_username}
                  </h6>
                  <div className="container-table">
                    <div class="table-section">
                      <div id="table-wrapper">
                        <div id="table-scroll2">
                          <div className="content-table">
                            <table id="table_transactions">
                              <thead>
                                <tr>
                                  <th>Transaction ID</th>
                                  <th>Sender</th>
                                  <th>Recipient</th>
                                  <th>Token code</th>
                                  <th>Amount</th>
                                  <th>Status</th>
                                </tr>
                              </thead>
                              <tbody>
                                {transactions.map((transaction, index) => (
                                  <tr key={index}>
                                    <td>{transaction.id}</td>
                                    <td>{transaction.sender}</td>
                                    <td>{transaction.recipient}</td>
                                    <td>{transaction.amount.code}</td>
                                    <td>{transaction.amount.value}</td>
                                    <td>{transaction.status}</td>
                                  </tr>
                                ))}
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
          </>
        )}
        <div className="container-fluid">
          <div class="content3">
            {keycloak.tokenParsed["type"] === "supplier" && (
              <>
                <div className="row">
                  <div className="col">
                    <div class="transaction-section2" style={{paddingRight:"90px"}}>
                      <h6>Issue Tokens</h6>
                      <div class="input-box">
                        <span class="details">Request ID</span>
                        <input
                          type="text"
                          id="request-id"
                          placeholder="Enter id"
                          required
                        ></input>
                      </div>
                      <div class="input-box">
                        <span class="details">Amount</span>
                        <input
                          type="text"
                          id="issued-amount"
                          placeholder="Enter amount"
                          required
                        ></input>
                      </div>
                      <div class="input-box">
                        <span class="details">Token Code</span>
                        <input
                          type="text"
                          id="issued-code"
                          placeholder="Enter token code"
                          required
                        ></input>
                      </div>
                      <div class="input-box">
                        <span class="details">Counterparty Account</span>
                        <input
                          type="text"
                          id="issued-account"
                          placeholder="Enter counterparty account"
                          required
                        ></input>
                      </div>
                      <div className="button">
                        <input
                          type="submit"
                          value="Issue"
                          onClick={() => {
                            requestService.tokenIssuance(
                              document.getElementById("request-id").value,
                              document.getElementById("issued-code").value,
                              document.getElementById("issued-amount").value,
                              document.getElementById("issued-account").value,
                              keycloak.tokenParsed.preferred_username
                            );
                            document.getElementById("request-id").value = "";
                            document.getElementById("issued-code").value = "";
                            document.getElementById("issued-amount").value = "";
                            document.getElementById("issued-account").value =
                              "";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col">
                    <div className="container-stacked">
                      <div class="transaction-section2">
                        <h6>Open Requests</h6>
                        <div className="container-table2">
                          <div class="table-section">
                            <div id="table-wrapper" style={{ width: "110%" }}>
                              <div id="table-scroll">
                                <div className="content-table">
                                  <table id="table_requests">
                                    <thead>
                                      <tr>
                                        <th>Request ID</th>
                                        <th>Initiator</th>
                                        <th>Date</th>
                                        <th>Token id</th>
                                        <th>Amount</th>
                                        <th>Status</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {issuanceRequests.length > 0 ? (
                                        issuanceRequests.map(
                                          (issuanceRequest, index) => (
                                            <tr key={index}>
                                              <td>{issuanceRequest.id}</td>
                                              <td>
                                                {issuanceRequest.initiator}
                                              </td>
                                              <td>{issuanceRequest.date}</td>
                                              <td>
                                                {issuanceRequest.token_id}
                                              </td>
                                              <td>{issuanceRequest.amount}</td>
                                              <td>{issuanceRequest.status}</td>
                                            </tr>
                                          )
                                        )
                                      ) : (
                                        <tr>
                                          <td colSpan="6">Data loading..</td>
                                        </tr>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div class="transaction-section2">
                          <h6>
                            Requests fullfilled by{" "}
                            {keycloak.tokenParsed.preferred_username}
                          </h6>
                          <div className="container-table2">
                            <div class="table-section">
                              <div id="table-wrapper" style={{ width: "110%" }}>
                                <div id="table-scroll">
                                  <div className="content-table">
                                    <table id="table_requests">
                                      <thead>
                                        <tr>
                                          <th>Request ID</th>
                                          <th>Initiator</th>
                                          <th>Date</th>
                                          <th>Token id</th>
                                          <th>Amount</th>
                                          <th>Issuer</th>
                                          <th>Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {issuanceRequestsByIssuer.length > 0 ? (
                                          issuanceRequestsByIssuer.map(
                                            (
                                              issuanceRequestsByIssuer,
                                              index
                                            ) => (
                                              <tr key={index}>
                                                <td>{issuanceRequestsByIssuer.id}</td>
                                                <td>{issuanceRequestsByIssuer.initiator}</td>
                                                <td>{issuanceRequestsByIssuer.date}</td>
                                                <td>{issuanceRequestsByIssuer.token_id}</td>
                                                <td>{issuanceRequestsByIssuer.amount}</td>
                                                <td>{issuanceRequestsByIssuer.issuer}</td>
                                                <td>{issuanceRequestsByIssuer.status}</td>
                                              </tr>
                                            )
                                          )
                                        ) : (
                                          <tr>
                                            <td colSpan="7">Data loading..</td>
                                          </tr>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestHandler;
