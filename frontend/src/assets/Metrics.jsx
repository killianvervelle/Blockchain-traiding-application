import Chart from "chart.js/auto";

/**
 * Metrics class provides methods to calculate and visualize transaction metrics.
 */

class Metrics {
  constructor(username) {
    this.username = username;
  }

  countTotalTransactions(transactions) {
    if (!transactions) return 0;
    return transactions.filter((tx) => tx.sender === this.username).length;
  }

  countPendingTransactions(transactions) {
    if (!transactions) return 0;
    return transactions.filter(
      (tx) => (tx.status === "Pending") & (tx.sender === this.username)
    ).length;
  }

  countConfirmedTransactions(transactions) {
    if (!transactions) return 0;
    return transactions.filter(
      (tx) => (tx.status === "Confirmed") & (tx.sender === this.username)
    ).length;
  }

  generateTransactionsGraph = (canvasRef, transactions) => {
    const userTransactions = transactions.filter((tx) => tx.sender === this.username);

    if (canvasRef.chartInstance) {
      canvasRef.chartInstance.destroy();
    }

    if (!userTransactions) {
      return new Chart();
    }
    const timestamps = userTransactions.map((tx) => tx.timestamp);
    const dates = timestamps.map((timestamp) => {
      const date = new Date(timestamp);
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      return `${month}-${year}`;
    });
    const occurrences = dates.reduce(function (acc, curr) {
      return acc[curr] ? ++acc[curr] : (acc[curr] = 1), acc;
    }, {});
    const sorted_occ = Object.entries(occurrences).sort((a, b) =>
      a[0].localeCompare(b[0])
    );
    const values = sorted_occ.map((pair) => pair[1]);
    const labels = sorted_occ.map((pair) => pair[0]);
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

    const chartInstance = new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });

    canvasRef.chartInstance = chartInstance;

    return chartInstance;
  };
}

export default Metrics;
