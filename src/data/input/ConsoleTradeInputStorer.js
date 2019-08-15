/**
 * A TradeInputStorer that outputs TradeInput data to the console.
 */
class ConsoleTradeInputStorer { /* implements TradeInputStorer */
  /**
   * @Override (see TradeInputStorer)
   */
  saveLeague(league) {
    console.log(league);
  }
}

export default ConsoleTradeInputStorer;