/**
 * Recommends best trades for a league.
 * TODO consider storing all possible trades and then comparing different algorithms to determine "best".
 *
 * TradeEnumerator tradeEnumerator
 * TradeEvaluator tradeEvaluator
 * TradePostProcessor tradePostProcessor
 */
class TradeRecommender {
  constructor(tradeEnumerator, tradeEvaluator, tradePostProcessor) {
    this.tradeEnumerator = tradeEnumerator;
    this.tradeEvaluator = tradeEvaluator;
    this.tradePostProcessor = tradePostProcessor
  }

  /**
   * Finds the best trades in the league.
   *
   * @param {League} league The league to find best trades
   * @return {Object} A "bestTradesMap" containing sorted lists of trades. It has the following structure
   {
      "overall": Trade[],
      "byTeam": {
        1: Trade[], // key = teamId
        2: Trade[],
        ...
      }
    }
   */
  findBestTrades(league) {
    const allTrades = this.tradeEnumerator.getAllTrades(league);
    console.log("Total trades: " + allTrades.length);
    const bestTradesMap = this.tradeEvaluator.findBestTrades(allTrades, league.teams);
    return this.tradePostProcessor.processTrades(bestTradesMap);
  }
}

export default TradeRecommender;