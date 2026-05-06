const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  async socketNotificationReceived(notification, payload) {
    if (notification === "GET_LOTTO_RESULTS") {
      this.config = payload;
      await this.getData();
    }
  },

  async getData() {
    const urlApi = "https://developers.lotto.pl/api/open/v1/lotteries/draw-results/last-results";
    let retry = false;

    try {
      const response = await fetch(urlApi, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Secret: this.config.api_key
        }
      });

      if (!response.ok) {
        throw new Error(`Lotto API error! status: ${response.status}`);
      }

      const data = await response.json();
      this.sendSocketNotification("LOTTO_DATA_RESULT", data);
    } catch (error) {
      console.error("MMM-PolishLotto: Fetch Error", error);
      retry = true;
    } finally {
      if (retry) {
        this.scheduleUpdate(this.config.retryDelay || 5000);
      }
    }
  },

  scheduleUpdate: function (delay) {
    let nextLoad = this.config.updateInterval || 300000; // Default 5 mins

    if (typeof delay !== "undefined" && delay >= 0) {
      nextLoad = delay;
    }

    setTimeout(() => {
      this.getData();
    }, nextLoad);
  }
});
