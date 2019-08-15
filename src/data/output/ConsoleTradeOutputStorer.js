import _ from 'lodash';

/**
 * A TradeOutputStorer that stores trade output data to the console.
 */
class ConsoleTradeOutputStorer { /* implements TradeOutputStorer */
  
  /////////////////////////////////////////////// Public Methods /////////////////////////////////////////////////////

  /**
   * @Override (see TradeOutputStorer)
   */
  saveTrades(league, bestTradesMap, currentWeek) {
    this._printBestTrades(bestTradesMap); 
  }

  /////////////////////////////////////////////// Private Methods /////////////////////////////////////////////////////

  /**
   * Print the bestTradesMap to the console.
   * @param {Object} bestTradesMap 
   * @private
   */
  _printBestTrades(bestTradesMap) {
    console.log("Total viable trades: " + bestTradesMap["overall"].length);
    //console.log(bestTradesMap);
    console.log(`best overall trades: ${_.map(bestTradesMap['overall'], (trade) => trade.toString())}\n.`);
      _.each(bestTradesMap['byTeam'], (trades, teamId) => {
        console.log(`best trades for team ${teamId} (${trades.length} total): ${_.map(trades, (trade) => trade.toString())}\n.`);
    });
  }
}

export default ConsoleTradeOutputStorer;