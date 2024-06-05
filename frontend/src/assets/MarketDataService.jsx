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
    const apiKey = `goldapi-3zarcneslwji2nvv-io`;

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
    const apiKey = "4a2648fe7759f8d9835beab29d2902dc";
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
    const apiKey = "UIQRT8NMK9T7KJF7EEEX333F7EEEX";
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
    //([_, data]) => data.metals.gold
    //);

    const values = [
      2391.9891, 2376.209, 2308.3269, 2319.1041, 2319.8395, 2334.0317,
      2337.7114, 2337.7502, 2329.7462, 2331.9188, 2287.3853, 2324.8888,
      2301.3768, 2302.6025, 2302.5892, 2312.6376, 2322.273, 2308.4628,
      2309.1057, 2351.2029, 2361.1073, 2361.2004, 2358.7988, 2342.8158,
      2357.7699, 2388.3152, 2377.319, 2414.7042, 2414.5823, 2434.0145,
    ];

    const labels = [
      "2024-04-21",
      "2024-04-22",
      "2024-04-23",
      "2024-04-24",
      "2024-04-25",
      "2024-04-26",
      "2024-04-27",
      "2024-04-28",
      "2024-04-29",
      "2024-04-30",
      "2024-05-01",
      "2024-05-02",
      "2024-05-03",
      "2024-05-04",
      "2024-05-05",
      "2024-05-06",
      "2024-05-07",
      "2024-05-08",
      "2024-05-09",
      "2024-05-10",
      "2024-05-11",
      "2024-05-12",
      "2024-05-13",
      "2024-05-14",
      "2024-05-15",
      "2024-05-16",
      "2024-05-17",
      "2024-05-18",
      "2024-05-19",
      "2024-05-20",
    ];

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
      this.chartInstance.clear();
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
