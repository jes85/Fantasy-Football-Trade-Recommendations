import _ from 'lodash';
/**
 * Evaluates a given list of trades according to a defined criteria.
 */
class TradeEvaluator {
  /**
   * Create a "bestTradesMap" containing sorted lists of trades. The map has the following structure:
    {
      "overall": [],
      "byTeam": {
        1: [], // key = teamId
        2: [].
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
    bestTradesMap["overall"] = bestOverallTrades;

    var bestTradesByTeamMap = {};
    _.each(teams, (team) => {
      var tradesWithTeam = _.filter(viableTrades, (trade) => trade.includesTeam(team));
      var bestTradesForTeam = _.sortBy(tradesWithTeam, (trade) => -trade.tradeScoreForTeam(team));
      bestTradesByTeamMap[team.id] = bestTradesForTeam;
    });
    bestTradesMap["byTeam"] = bestTradesByTeamMap;

    return bestTradesMap;
  }

  printBestTrades(bestTradesMap) {
    console.log(`best overall trades: ${_.map(bestTradesMap['overall'], (trade) => trade.toString())}\n.`);
    _.each(bestTradesMap['byTeam'], (trades, teamId) => {
      console.log(`best trades for team ${teamId} (${trades.length} total): ${_.map(trades, (trade) => trade.toString())}\n.`);
    });
  }
}

export default TradeEvaluator;