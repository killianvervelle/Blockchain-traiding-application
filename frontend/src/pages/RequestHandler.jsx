import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FabricService from "../assets/FabricService";
import { useKeycloak } from "@react-keycloak/web";

/**
 * RequestHandler component enables methods to interact with the blockchain such as issue, transfer and redeem tokens.
 * 
 * @returns {JSX.Element} The rendered RequestHandler component.
 */

const RequestHandler = () => {
  const { keycloak, initialized } = useKeycloak();
  const [transactions, setTransactions] = useState([]);
  const [fabricService, setFabricService] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (initialized && keycloak.authenticated) {
      const newService = new FabricService(
        keycloak.tokenParsed.preferred_username
      );
      setFabricService(newService);
    }
  }, [initialized, keycloak]);

  useEffect(() => {
    const fetchdata = async () => {
      if (fabricService) {
        try {
          const transactionsData = await fabricService.GetAccountTransactions();
          setTransactions(transactionsData.payload || []);
        } catch (error) {
          console.error("Failed to fetch balances:", error);
        }
      }
    };

    fetchdata();
  }, [fabricService]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const issueTokens = async (code, amount, account) => {
    try {
      const response = await fabricService.IssueTokens({
        code: code,
        amount: amount,
        account: account,
      });
      console.log(response);
    } catch (error) {
      console.error("Failed to issue tokens:", error);
    }
  };

  const transferTokens = async (code, amount, account) => {
    try {
      const response = await fabricService.TransferTokens({
        code: code,
        amount: amount,
        account: account,
      });
      console.log(response);
    } catch (error) {
      console.error("Failed to transfer tokens:", error);
    }
  };

  const redeemTokens = async (code, amount) => {
    try {
      const response = await fabricService.RedeemTokens({
        code: code,
        amount: amount,
      });
      console.log(response);
    } catch (error) {
      console.error("Failed to redeem tokens:", error);
    }
  };

  return (
    <div class="container">
      <div class="content">
        <div class="transaction-section">
          <h5>Issue Tokens</h5>
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
                issueTokens(
                  document.getElementById("issued-code").value,
                  document.getElementById("issued-amount").value,
                  document.getElementById("issued-account").value
                );
                document.getElementById("issued-code").value = "";
                document.getElementById("issued-amount").value = "";
                document.getElementById("issued-account").value = "";
              }}
            />
          </div>
        </div>

        <div class="transaction-section">
          <h5>Transfer Tokens</h5>
          <div class="input-box">
            <span class="details">Amount</span>
            <input
              type="number"
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
                transferTokens(
                  document.getElementById("transfered-code").value,
                  document.getElementById("transfered-amount").value,
                  document.getElementById("transfered-account").value
                );
                document.getElementById("transfered-code").value = "";
                document.getElementById("transfered-amount").value = "";
                document.getElementById("transfered-account").value = "";
              }}
            />
          </div>
        </div>

        <div class="transaction-section">
          <h5>Redeem Tokens</h5>
          <div class="input-box">
            <span class="details">Amount</span>
            <input
              type="number"
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
                redeemTokens(
                  document.getElementById("redeemed-code").value,
                  document.getElementById("redeemed-amount").value
                );
                document.getElementById("redeemed-code").value = "";
                document.getElementById("redeemed-amount").value = "";
              }}
            />
          </div>
        </div>
      </div>
      <div className="container-table">
        <div class="table-section">
          <div id="table-wrapper">
            <div id="table-scroll">
              <div className="content-table">
                <h5>Transactions</h5>
                <table id="table_transactions">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Sender</th>
                      <th>Recipient</th>
                      <th>Amount Code</th>
                      <th>Amount Value</th>
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
  );
};

export default RequestHandler;
