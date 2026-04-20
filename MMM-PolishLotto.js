Module.register("MMM-PolishLotto", {
  defaults: {
    api_key: "", // Set this in your config.js
    updateInterval: 10 * 60 * 1000, // Every 10 minutes
    gameTitle: "Mini Lotto"
  },

  getStyles() {
    return ["MMM-PolishLotto.css"];
  },

  start() {
    this.lottoData = null;
    this.loaded = false;

    // Initial fetch
    this.getLottoData();

    // Set interval for updates
    setInterval(() => {
      this.getLottoData();
    }, this.config.updateInterval);
  },

  getLottoData() {
    this.sendSocketNotification("GET_LOTTO_RESULTS", this.config);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "LOTTO_DATA_RESULT") {
      // Assuming the API returns an array, we take the first result
      this.lottoData = payload[0];
      this.loaded = true;
      this.updateDom();
    }
  },

  getDom() {
    const wrapper = document.createElement("div");
    wrapper.className = "lotto-wrapper";

    if (!this.config.api_key) {
      wrapper.innerHTML = "Please set API Key.";
      return wrapper;
    }

    if (!this.loaded) {
      wrapper.innerHTML = "Loading Lotto results...";
      return wrapper;
    }

    if (this.lottoData) {
      // Example of displaying results:
      // Adjust keys (results, drawDate) based on actual API response structure
      const title = document.createElement("div");
      title.className = "bold small";
      title.innerHTML = `${this.config.gameTitle} - ${this.lottoData.drawDate || ""}`;

      const results = document.createElement("div");
      results.className = "bright medium";

      // Join the winning numbers with a space or dash
      const numbers = this.lottoData.results?.[0]?.numbers || [];
      results.innerHTML = numbers.length > 0 ? numbers.join(" ") : "No results found";

      wrapper.appendChild(title);
      wrapper.appendChild(results);
    } else {
      wrapper.innerHTML = "No data available.";
    }

    return wrapper;
  }
});
