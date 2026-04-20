Module.register("MMM-PolishLotto", {
  defaults: {
    api_key: "",
    updateInterval: 6 * 60 * 60 * 1000,
    subscribedGames: ['Lotto'],
    myNumbers: {}
  },

  getStyles() {
    return ["MMM-PolishLotto.css"]
  },

  start() {
    this.lottoResults = []
    this.loaded = false
    this.getLottoData()
    setInterval(() => this.getLottoData(), this.config.updateInterval)
  },

  getLottoData() {
    this.sendSocketNotification("GET_LOTTO_RESULTS", this.config)
  },

  socketNotificationReceived(notification, payload) {
    if (notification === "LOTTO_DATA_RESULT") {
      this.lottoResults = payload
      this.loaded = true
      this.updateDom()
    }
  },

  getDom() {
    const wrapper = document.createElement("div")
    wrapper.className = "lotto-container"

    if (!this.loaded) {
      wrapper.innerHTML = "Loading Lotto..."
      return wrapper
    }

    const filteredResults = this.lottoResults.filter((item) => {
      if (!this.config.subscribedGames || this.config.subscribedGames.length === 0) return true
      return this.config.subscribedGames.includes(item.gameType)
    })

    filteredResults.forEach((gameDraw) => {
      gameDraw.results.forEach((res) => {
        const gameWrapper = document.createElement("div")
        gameWrapper.className = "lotto-game-row"

        const title = document.createElement("div")
        const date = gameDraw.drawDate.split("T")[0]
        title.className = "lotto-title small bright"
        title.innerHTML = `${res.gameType} <span class="dimmed">(${date})</span>`
        gameWrapper.appendChild(title)

        const ballsContainer = document.createElement("div")
        ballsContainer.className = "lotto-balls-container"

        const mySelected = this.config.myNumbers[res.gameType] || []

        res.resultsJson.forEach((num) => {
          const ball = document.createElement("span")
          ball.className = "lotto-ball"
          if (mySelected.includes(num)) ball.className += " lotto-match"
          ball.innerHTML = num
          ballsContainer.appendChild(ball)
        })

        if (res.specialResults && res.specialResults.length > 0) {
          res.specialResults.forEach((num) => {
            const ball = document.createElement("span")
            ball.className = "lotto-ball lotto-special"
            if (mySelected.includes(num)) ball.className += " lotto-match"
            ball.innerHTML = num
            ballsContainer.appendChild(ball)
          })
        }

        gameWrapper.appendChild(ballsContainer)
        wrapper.appendChild(gameWrapper)
      })
    })

    return wrapper
  }
})
