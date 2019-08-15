import fs from 'fs';

/**
 * A TradeOutputStorer that stores trade output data to the file system.
 */
class FileBasedTradeOutputStorer { /* implements TradeOutputStorer */

  /**
   * 
   * @param {String} jsonFilePath Path to the json file where the data should be stored
   * @param {String} jsFilePath Path to the js file where the data should be stored
   */
  constructor(jsonFilePath, jsFilePath) {
    this.jsonFilePath = jsonFilePath;
    this.jsFilePath = jsFilePath;

  }

  /**
   * @Override (see TradeOutputStorer)
   */
  saveTrades(tradeOutput) {
    // Read exisitng json and add bestTrades for this league to it, overriding exisiting data for this leagueId if it exists.
    var bestTradesJson = fs.readFileSync(this.jsonFilePath);
    var bestTradesAllLeagues = JSON.parse(bestTradesJson);
    bestTradesAllLeagues[tradeOutput.leagueId] = tradeOutput.bestTradesMap;
    var newBestTradesJson = JSON.stringify(bestTradesAllLeagues, null, 2);

    // Write the updated json to a json file.
    fs.writeFile(this.jsonFilePath, newBestTradesJson, 'utf8', (err) => {

    });

    // Also write to a js object for now for ease of using it in the front end app
    // Eventually, we should have the front end call a backend to get the data
    fs.writeFile(this.jsFilePath, "const bestTradesAllLeagues = ", 'utf8', (err) => {
      fs.appendFile(this.jsFilePath, newBestTradesJson, 'utf8', (err) => {
        fs.appendFile(this.jsFilePath, "\nexport default bestTradesAllLeagues;", 'utf8', (err) => {

        });
      });
    });
  }
}

export default FileBasedTradeOutputStorer;