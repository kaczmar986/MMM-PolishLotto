Module.register("MMM-PolishLotto", {
  defaults: {
    api_key: "",
    updateInterval: 10 * 60 * 1000, // Default to 10 minutes
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

    // Use the config value for the update interval
    setInterval(() => {
      this.getLottoData();
    }, this.config.updateInterval);
  },

  getLottoData() {
    this.sendSocketNotification("GET_LOTTO_RESULTS", this.config);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "LOTTO_DATA_RESULT") {
      // payload is the array from your Postman test
      this.lottoData = payload[0];
      this.loaded = true;
      this.updateDom();
    }
  },

  getDom() {
    const wrapper = document.createElement("div");

    if (!this.loaded) {
      wrapper.innerHTML = "Loading Mini Lotto...";
      wrapper.className = "dimmed light small";
      return wrapper;
    }

    if (this.lottoData && this.lottoData.results && this.lottoData.results[0]) {
      const container = document.createElement("div");

      // Format the date (e.g., 2026-04-19)
      const dateStr = this.lottoData.drawDate ? this.lottoData.drawDate.split('T')[0] : "";

      const title = document.createElement("div");
      title.className = "small bright";
      title.innerHTML = `${this.config.gameTitle} (${dateStr})`;
      container.appendChild(title);

      const numbersWrapper = document.createElement("div");
      numbersWrapper.className = "medium bold bright";

      // Mapping to resultsJson from your Postman example
      const numbers = this.lottoData.results[0].resultsJson || [];
      numbersWrapper.innerHTML = numbers.join("  ");

      container.appendChild(numbersWrapper);
      wrapper.appendChild(container);
    } else {
      wrapper.innerHTML = "No data available";
      wrapper.className = "dimmed small";
    }

    return wrapper;
  }
});
