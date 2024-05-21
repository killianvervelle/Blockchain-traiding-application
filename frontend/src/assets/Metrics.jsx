import Chart from "chart.js/auto";

class Metrics {
  constructor(transactions, username) {
    this.transactions = transactions;
    this.username = username;
    this.chartInstance = null;
  }

  countTotalTransactions() {
    return this.transactions.filter((tx) => tx.sender === this.username).length;
  }

  countPendingTransactions() {
    return this.transactions.filter(
      (tx) => (tx.status === "Pending") & (tx.sender === this.username)
    ).length;
  }

  countConfirmedTransactions() {
    return this.transactions.filter(
      (tx) => (tx.status === "Confirmed") & (tx.sender === this.username)
    ).length;
  }

  generateTransactionsGraph = (canvasRef) => {
    if (!this.transactions) {
      return new Chart();
    }
    const timestamps = this.transactions.map((tx) => tx.timestamp);
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

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    this.chartInstance = new Chart(ctx, {
      type: "bar",
      data: data,
      options: options,
    });
    return this.chartInstance;
  };
}

export default Metrics;
