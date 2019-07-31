import _ from 'lodash';

class ConsoleTradeOutputStorer {
  
  /**
   * Public Methods.
   */
  saveTrades(league, bestTradesMap, currentWeek) {
    this.printBestTrades(bestTradesMap); 
  }

  /**
   * Private Methods.
   */
  printBestTrades(bestTradesMap) {
    console.log("Total viable trades: " + bestTradesMap["overall"].length);
    //console.log(bestTradesMap);
    console.log(`best overall trades: ${_.map(bestTradesMap['overall'], (trade) => trade.toString())}\n.`);
      _.each(bestTradesMap['byTeam'], (trades, teamId) => {
        console.log(`best trades for team ${teamId} (${trades.length} total): ${_.map(trades, (trade) => trade.toString())}\n.`);
    });
  }
}

export default ConsoleTradeOutputStorer;