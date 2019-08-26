/**
 * A TradeInputStorer that outputs TradeInput data to the console.
 */
class ConsoleTradeInputStorer { /* implements TradeInputStorer */

  /**
   * @Override (see TradeInputStorer)
   */
  saveTradeInput(tradeInput) {
    this.saveLeague(tradeInput.league);
    this.savePlayerProjections(tradeInput.playerProjections);
  }

  /**
   * @Override (see TradeInputStorer)
   */
  saveLeague(league) {
    console.log(league);
  }

  /**
   * @Override (see TradeInputStorer)
   */
  savePlayerProjections(playerProjections) {
    console.log(playerProjections);
  }
}

export default ConsoleTradeInputStorer;