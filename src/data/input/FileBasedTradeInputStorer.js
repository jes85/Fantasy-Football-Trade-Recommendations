import fs from 'fs';

/**
 * A TradeInputStorer that stores TradeInput data to the file system.
 */
class FileBasedTradeInputStorer { /* implements TradeInputStorer */

  /**
   * 
   * @param {String} jsonFilePath Path to the json file where the data should be stored
   * @param {String} jsFilePath Path to the js file where the data should be stored
   */
  constructor(jsonFilePath, jsFilePath) {
    this.jsonFilePath = jsonFilePath;
    this.jsFilePath = jsFilePath;
  }
  
  /*
   * @Override (see TradeInputStorer)
   */
  saveLeague(league) {
    // Read exisitng json and add this league to it, overriding exisiting data for this leagueId if it exists.
    var leaguesJson = fs.readFileSync(this.jsonFilePath);
    var leagues = JSON.parse(leaguesJson);
    leagues[league.leagueId] = league;
    var newLeaguesJson = JSON.stringify(leagues, null, 2);

    // Write the updated json to a json file.
    fs.writeFile(this.jsonFilePath, newLeaguesJson, 'utf8', (err) => {

    });

    // Also write to a js object for now for ease of using it in the front end app
    // Eventually, we should have the front end call a backend to get the data
    fs.writeFile(this.jsFilePath, "const leagues = ", 'utf8', (err) => {
      fs.appendFile(this.jsFilePath, newLeaguesJson, 'utf8', (err) => {
        fs.appendFile(this.jsFilePath, "\nexport default leagues;", 'utf8', (err) => {

        });
      });
    });
  }
}

export default FileBasedTradeInputStorer;