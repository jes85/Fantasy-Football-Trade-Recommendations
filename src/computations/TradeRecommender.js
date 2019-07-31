// todo consider storing all possible trades and then comparing different algorithms to determine "best".
class TradeRecommender {
  constructor(tradeEnumerator, tradeEvaluator) {
    this.tradeEnumerator = tradeEnumerator;
    this.tradeEvaluator = tradeEvaluator;
  }

  findBestTrades(league) {
    var allTrades = this.tradeEnumerator.getAllTrades(league);
    console.log("Total trades: " + allTrades.length);
    return this.tradeEvaluator.findBestTrades(allTrades, league.teams);
  }
}

export default TradeRecommender;