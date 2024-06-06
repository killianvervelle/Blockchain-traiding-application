import Chart from "chart.js/auto";

/**
 * MarketDataService class provides methods to fetch and process market data such as gold prices
 * and exchange rates, and to generate visualizations for these data.
 */

class MarketDataService {
  constructor() {
    this.chartInstance = null;
  }

  async fetchGoldPrice(userLocalization) {
    const apiKey = `your key`;

    const fetchPrice = async (currency) => {
      const apiUrl = `https://www.goldapi.io/api/XAU/${currency}`;
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "x-access-token": apiKey,
        },
      });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(
          `Failed to fetch gold price with base currency ${currency}`
        );
      }
      return data;
    };

    try {
      return await fetchPrice(userLocalization[0]);
    } catch (error) {
      console.warn(
        `Attempt to fetch gold price with ${userLocalization[0]} failed. Trying next currency...`,
        error
      );
      if (userLocalization.length > 1) {
        try {
          return await fetchPrice(userLocalization[1]);
        } catch (error) {
          console.error(
            "Failed to fetch gold price with both currencies:",
            error
          );
          throw error;
        }
      } else {
        console.error("No alternative currency to fall back on:", error);
        throw error;
      }
    }
  }

  async fetchExchangeRates(userLocalization) {
    const apiKey = "your key";
    const fetchRates = async (currency) => {
      const apiUrl = `https://api.metalpriceapi.com/v1/latest?api_key=${apiKey}&base=${currency}`;
      const response = await fetch(apiUrl, { method: "GET" });
      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(
          `Failed to fetch exchange rates with base currency ${currency}`
        );
      }
      return data;
    };

    try {
      return await fetchRates(userLocalization[0]);
    } catch (error) {
      console.warn(
        `Attempt to fetch exchange rates with ${userLocalization[0]} failed. Trying next currency...`,
        error
      );
      if (userLocalization.length > 1) {
        try {
          return await fetchRates(userLocalization[1]);
        } catch (error) {
          console.error(
            "Failed to fetch exchange rates with both currencies:",
            error
          );
          throw error;
        }
      } else {
        console.error("No alternative currency to fall back on:", error);
        throw error;
      }
    }
  }

  async fetch12Mgoldprices() {
    const apiKey = "your key";
    const currentDate = new Date();
    const twelveMonthsAgoDate = new Date();
    twelveMonthsAgoDate.setMonth(twelveMonthsAgoDate.getMonth() - 1);
    const formattedCurrentDate = currentDate.toISOString().slice(0, 10);
    const formattedTwelveMonthsAgoDate = twelveMonthsAgoDate
      .toISOString()
      .slice(0, 10);
    try {
      const startDate = formattedTwelveMonthsAgoDate;
      const endDate = formattedCurrentDate;
      const apiUrl = `https://api.metals.dev/v1/timeseries?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;
      const response = await fetch(apiUrl, {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch 12 month gold price:", error);
      throw error;
    }
  }

  async user_geolocalization() {
    const apiKey = "2948a8411f09401195946481a491ec69";
    try {
      const apiUrl = `https://api.geoapify.com/v1/ipinfo?&apiKey=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = response.json();
      return data;
    } catch (error) {
      console.error("Failed to fetch user geolocalization:", error);
      throw error;
    }
  }

  async generateGoldPriceGraph(canvasRef) {
    //const goldPriceData = await this.fetch12Mgoldprices();
    //const labels = Object.keys(goldPriceData.rates);
    //const values = Object.entries(goldPriceData.rates).map(
    //([_, data]) => data.metals.gold);

    // Currently, the data is hard coded, but eventually you will need to set up an account to use the API.

    const values = [...Array(30)].map(() => Math.random() * (2434.0145 - 2391.9891) + 2391.9891);

    const labels = Array.from({ length: 31 }, (_, i) => {
      const date = new Date("2024-04-21");
      date.setDate(date.getDate() + i);
      return date.toISOString().split('T')[0];
    });
    
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
              step: 1,
            },
          },
        },
      },
    };
    const ctx = canvasRef.getContext("2d");

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(ctx, {
      type: "line",
      data: data,
      options: options,
    });
    return this.chartInstance;
  }
}

export default MarketDataService;
