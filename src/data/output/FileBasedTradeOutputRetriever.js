import fs from 'fs';
import TradeOutput from './TradeOutput.js';

/**
 * A TradeOutputRetriever that retrieves trade output data from the file system.
 */
class FileBasedTradeOutputRetriever { /* implements TradeOutputRetriever */

  /**
   *
   * @param {String} jsonFilePath Path to the json file where the data is stored
   */
  constructor(jsonFilePath) {
    this.jsonFilePath = jsonFilePath;
  }

  /**
   * @Override (see TradeOutputRetriever)
   */
  loadTrades(leagueId, seasonId, weekId) {
    var bestTradesMapsJson = fs.readFileSync(this.jsonFilePath);
    var bestTradesMaps = JSON.parse(bestTradesMapsJson);
    return new TradeOutput(
      leagueId,
      seasonId,
      weekId,
      bestTradesMaps[leagueId]);
  }
}

export default FileBasedTradeOutputRetriever;