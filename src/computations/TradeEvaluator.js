import _ from 'lodash';

/**
 * Evaluates a given list of trades according to a defined criteria.
 */
class TradeEvaluator {
  /**
   * Create a "bestTradesMap" containing sorted lists of trades.
   *
   * @param {Trade[]} trades A list of trades to evaluate.
   * @param {Team[]} teams A list of teams involved in the trades.
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
  findBestTrades(trades, teams) {
    var bestTradesMap = {};
    // Filture all trades that are definitely bad (negative scores)
    //var viableTrades = trades;
    var viableTrades = _.filter(trades, (trade) => trade.overallTradeScore > 0);

    console.log("Viable Trades: " + viableTrades.length);

    // Sort by descending score (best scores first).
    var bestOverallTrades = _.sortBy(viableTrades, (trade) => -trade.overallTradeScore);
    bestTradesMap["overall"] = bestOverallTrades.slice(0, 10);

    var bestTradesByTeamMap = {};
    _.each(teams, (team) => {
      var tradesWithTeam = _.filter(viableTrades, (trade) => trade.involvesTeam(team));
      var bestTradesForTeam = _.sortBy(tradesWithTeam, (trade) => -trade.tradeScoreForTeam(team));
      
      bestTradesByTeamMap[team.nickname] = bestTradesForTeam.slice(0, 10);
    });
    bestTradesMap["byTeam"] = bestTradesByTeamMap;

    return bestTradesMap;
  }
}

export default TradeEvaluator;