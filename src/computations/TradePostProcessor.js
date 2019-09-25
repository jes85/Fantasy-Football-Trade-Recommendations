import _ from 'lodash';

/**
 * Filters a best trades map to make it look better to humans.
 * This can be merged in with the TradeEvaluator in the future, but I'm leaving it separate for now so I
 * can experiment with different post processors after I evaluate all trades in a brute force manner.
 */
class TradePostProcessor {
  /**
   * Create a "bestTradesMap" containing sorted lists of trades.
   *
   * @param {Object} bestTradesMap A "bestTradesMap" containing sorted lists of trades. See below for the structure
   * @return {Object} A new bestTradesMap with some trades filtered out or reordered. It has the following structure
   {
      "overall": Trade[],
      "byTeam": {
        1: Trade[], // key = teamId
        2: Trade[],
        ...
      }
    }
   */
  processTrades(bestTradesMap) {
    var newBestTradesMap = {};

    var newOverall = bestTradesMap["overall"];
    newOverall = this.removeDuplicates(newOverall);
    newOverall = newOverall.slice(0, 50);
    newBestTradesMap["overall"] = newOverall;

    var newByTeam = {};
    _.each(bestTradesMap["byTeam"], (tradesForTeam, teamNickname) => {

      var newTradesForTeam = this.removeDuplicates(tradesForTeam);

      newByTeam[teamNickname] = newTradesForTeam;
    });
    newBestTradesMap["byTeam"] = newByTeam;

    return newBestTradesMap;
  }

  // Remove any trade that is with the same team and contains at least one player from each team that's the same.
  removeDuplicates(tradesForTeam) {
    var newTradesForTeam = [];
    _.each(tradesForTeam, (trade) => {
      var duplicate = _.find(newTradesForTeam, (existingTrade) => {
        if (existingTrade.team1 == trade.team1
          && existingTrade.team2 == trade.team2
          && !_.isEmpty(_.intersection(existingTrade.team1PlayersToTrade, trade.team1PlayersToTrade))
          && !_.isEmpty(_.intersection(existingTrade.team2PlayersToTrade, trade.team2PlayersToTrade))
        ) {
          return true;
        } else {
          return false;
        }
      });
      if (!duplicate) {
        newTradesForTeam.push(trade);
      }
    });
    return newTradesForTeam;
  }
}

export default TradePostProcessor;