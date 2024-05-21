const OWNER_API_URL = "http://localhost:9200/api/v1/";
const ISSUER_API_URL = "http://localhost:9100/api/v1/";

class FabricService {
  constructor(ID) {
    this.ID = ID;
  }

  async IssueTokens(data) {
    console.log("Issuance request initiated...");
    const response = await fetch(ISSUER_API_URL + "issuer/issue", {
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

  async GetAccountBalances() {
    const response = await fetch(OWNER_API_URL + "owner/accounts/" + this.ID, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        "Failed to fetch balances for the account with the ID: " + this.ID
      );
    }
    return response.json();
  }

  async GetAccountTransactions() {
    const response = await fetch(
      OWNER_API_URL + "owner/accounts/" + this.ID + "/transactions",
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
    return response.json();
  }

  async TransferTokens(data) {
    console.log("Transfer request initiated...");
    const response = await fetch(
      OWNER_API_URL + "owner/accounts/" + this.ID + "/transfer",
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

  async RedeemTokens(data) {
    console.log("Redemption request initiated...");
    const response = await fetch(
      OWNER_API_URL + "owner/accounts/" + this.ID + "/redeem",
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
}

export default FabricService;
