import Chart from "chart.js/auto";

/**
 * RequestService class provides methods to interact with the application's backend.
 * It allows inserting, extracting and modifying database data.
 */

class RequestService {
  constructor(fabricService) {
    this.fabricService = fabricService;
    this.BACKEND_URL = "http://localhost:8081";
  }

  async tokenIssuance(id, code, amount, account, user) {
    try {
      const response = await this.getIssuanceRequestStatus(id);
      if (response) {
        try {
          const fabricResponse = await this.fabricService.issueTokens({
            code: code,
            amount: amount,
            account: account,
          });
          if (fabricResponse) {
            console.log("Tokens issued successfully:", fabricResponse);
            this.updateIssuanceRequestStatus(id, user);
          } else {
            console.error("Failed to issue tokens:", fabricResponse);
          }
        } catch (fabricError) {
          console.error("Error issuing tokens:", fabricError);
        }
      } else {
        console.error("Failed tom update issuance request status:", response);
      }
    } catch (issuanceError) {
      console.error("Error updating issuance request status:", issuanceError);
    }
  }

  async tokenTransfer(code, amount, account) {
    try {
      const response = await this.fabricService.transferTokens({
        code: code,
        amount: amount,
        account: account,
      });
      if (response) {
        console.log("Tokens transferred successfully");
      } else {
        console.error("Failed to transfer tokens", response);
      }
    } catch (error) {
      console.error("Error transferring tokens", error);
    }
  }

  async tokenRedemption(code, amount) {
    try {
      const response = await this.fabricService.redeemTokens({
        code: code,
        amount: amount,
      });
      if (response) {
        console.log("Tokens redeemed successfully");
      } else {
        console.error("Failed to redeem tokens", response);
      }
    } catch (error) {
      console.error("Error redeeming tokens", error);
    }
  }

  async tokenIssuanceRequest(token_id, amount, user) {
    const issuanceRequestDto = {
      initiator: user,
      date: new Date().toISOString(),
      token_id: token_id,
      amount: amount,
      issuer: "",
      status: "Open",
    };
    try {
      const response = await fetch(
        this.BACKEND_URL + "/register/issuance-request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(issuanceRequestDto),
        }
      );
      if (response.ok) {
        const result = await response.json();
        console.log("Issuance request status:", result);
      } else {
        console.error("Failed to register issuance request.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async updateIssuanceRequestStatus(id, issuer) {
    try {
      const response = await fetch(
        this.BACKEND_URL + "/update/" + issuer + "/" + id,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        console.log("Issuance request with id " + id + " has been fullfilled");
        return response;
      } else {
        console.error("Failed to register issuance request.");
      }
    } catch (error) {
      console.error("Error updating issuance request status:", error);
    }
  }

  async getIssuanceRequestStatus(id) {
    try {
      const response = await fetch(this.BACKEND_URL + "/check-request/" + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        console.error("Issuance request with id: " + id + " not found.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching issuance request status:", error);
    }
  }

  async getAllIssuanceRequest() {
    try {
      const response = await fetch(this.BACKEND_URL + "/issuance-requests", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        console.error("Failed to fetch token issuance requests.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching token issuance requests:", error);
      return [];
    }
  }

  async getAllIssuanceRequestByIssuer(issuer) {
    try {
      const response = await fetch(
        this.BACKEND_URL + "/issuance-requests/" + issuer,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        console.error("Failed to fetch token issuance requests.");
        return [];
      }
    } catch (error) {
      console.error("Error fetching token issuance requests:", error);
      return [];
    }
  }

  async generateFulfilledRequetsGraph(canvasRef, requests) {

    if (canvasRef.chartInstance) {
      canvasRef.chartInstance.destroy();
    }

    if (!requests) {
      return new Chart();
    }

    const months = requests.map((tx) => {
      const date = new Date(tx.date);
      return `${date.getMonth() + 1}-${date.getFullYear()}`;
    });

    const occurrences = months.reduce((acc, curr) => {
      acc[curr] = (acc[curr] || 0) + 1;
      return acc;
    }, {});

    const sortedMonths = Object.keys(occurrences).sort((a, b) => {
      const [monthA, yearA] = a.split("-");
      const [monthB, yearB] = b.split("-");
      return new Date(yearA, monthA - 1) - new Date(yearB, monthB - 1);
    });

    const labels = sortedMonths.map((month) => month);
    const values = sortedMonths.map((month) => occurrences[month]);

    const data = {
      labels: labels,
      datasets: [
        {
          label: "Values",
          data: values,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };

    const options = {
      plugins: {
        legend: {
          display: false,
        },
        scales: {
          y: {
            beginAtZero: true,
            suggestedMax: Math.max(...values) + 1,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    };

    const ctx = canvasRef.getContext("2d");

    const chartInstance = new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });

    canvasRef.chartInstance = chartInstance;

    return chartInstance;
  }
}

export default RequestService;
