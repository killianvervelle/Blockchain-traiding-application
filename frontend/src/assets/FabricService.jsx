/**
 * FabricService class provides methods to interact with a blockchain-based token system.
 * It allows issuing, transferring, redeeming tokens, and retrieving account balances and transactions.
 */

class FabricService {
  constructor(ID) {
    this.ID = ID;
    this.OWNER_API_URL = "http://localhost:9200/api/v1/";
    this.ISSUER_API_URL = "http://localhost:9100/api/v1/";
  }

  async issueTokens(data) {
    console.log("DATA", parseInt(data.amount))
    console.log("Tokens being issued from: " + this.ID);
    const response = await fetch(this.ISSUER_API_URL + "issuer/issue", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: {
          code: data.code,
          value: parseInt(data.amount),
        },
        counterparty: {
          node: "owner1",
          account: data.account,
        },
        message: "string",
      }),
    });

    if (!response.ok) {
      throw new Error("Issuance request failed");
    }
    return response.json();
  }

  async getAccountBalances() {
    const response = await fetch(
      this.OWNER_API_URL + "owner/accounts/" + this.ID,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch balances for the account with the ID: " + this.ID
      );
    }
    return response.json();
  }

  async transferTokens(data) {
    console.log(
      "Tokens getting transfered from " + this.ID + " to " + data.account
    );
    const response = await fetch(
      this.OWNER_API_URL + "owner/accounts/" + this.ID + "/transfer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: {
            code: data.code,
            value: parseInt(data.amount),
          },
          counterparty: {
            node: "owner1",
            account: data.account,
          },
          message: "string",
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Failed to fetch balances for the account with the ID: " + this.ID
      );
    }
    return response.json();
  }

  async redeemTokens(data) {
    console.log("Redemption request initiated...");
    const response = await fetch(
      this.OWNER_API_URL + "owner/accounts/" + this.ID + "/redeem",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: {
            code: data.code,
            value: parseInt(data.amount),
          },
          message: "string",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Redeemption request failed");
    }
    return response.json();
  }

  async getAccountTransactions() {
    console.log("Fetching the user's transactions...");
    const response = await fetch(
      this.OWNER_API_URL + "owner/accounts/" + this.ID + "/transactions",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Transfer request failed.");
    }
    return await response.json();
  }
}

export default FabricService;
