const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  async socketNotificationReceived(notification, payload) {
    if (notification === "GET_LOTTO_RESULTS") {
      this.config = payload;
      await this.getData();
    }
  },

  async getData() {
    const game = "MiniLotto";
    const urlApi = `https://developers.lotto.pl/api/open/v1/lotteries/draw-results/last-results-per-game?game=${game}`;

    try {
      const response = await fetch(urlApi, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Secret": this.config.api_key // Added the Secret key header here
        }
      });

      if (!response.ok) {
        throw new Error(`Lotto API error! status: ${response.status}`);
      }

      const data = await response.json();
      this.sendSocketNotification("LOTTO_DATA_RESULT", data);
    } catch (error) {
      console.error("MMM-PolishLotto: Fetch Error", error);
    }
  }
});
