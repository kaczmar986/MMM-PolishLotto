Module.register("MMM-PolishLotto", {
  defaults: {
    api_key: "",
    updateInterval: 10 * 60 * 1000,
    gameTitle: "Mini Lotto"
  },

  getStyles() {
    return ["MMM-PolishLotto.css"];
  },

  start() {
    this.lottoData = null;
    this.loaded = false;
    this.getLottoData();

    setInterval(() => {
      this.getLottoData();
    }, this.config.updateInterval);
  },

  getLottoData() {
    this.sendSocketNotification("GET_LOTTO_RESULTS", this.config);
  },

  socketNotificationReceived: function (notification, payload) {
    if (notification === "LOTTO_DATA_RESULT") {
      // payload is an array, we want the first object
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

    if (this.lottoData) {
      const container = document.createElement("div");

      // Date formatting (removes the T and Z from the timestamp)
      const dateStr = this.lottoData.drawDate.split('T')[0];

      const title = document.createElement("div");
      title.className = "small bright";
      title.innerHTML = `${this.config.gameTitle} (${dateStr})`;
      container.appendChild(title);

      const numbersWrapper = document.createElement("div");
      numbersWrapper.className = "medium bold bright";

      // Accessing results[0].resultsJson based on your Postman output
      const numbers = this.lottoData.results[0].resultsJson;
      numbersWrapper.innerHTML = numbers.join("  ");

      container.appendChild(numbersWrapper);
      wrapper.appendChild(container);
    } else {
      wrapper.innerHTML = "No data found";
    }

    return wrapper;
  }
});
