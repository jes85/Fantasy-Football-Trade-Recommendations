import fs from 'fs';

/**
 * A TradeInputStorer that stores TradeInput data to the file system.
 */
class FileBasedTradeInputStorer { /* implements TradeInputStorer */

  /**
   *
   * @param {String} leagueJsonFilePath Path to the json file where the league data should be stored
   * @param {String} leagueJsFilePath Path to the js file where the league data should be stored
   * @param {String} projectionsJsonFilePath Path to the json file where the player projections should be stored
   */
  constructor(leagueJsonFilePath, leagueJsFilePath, projectionsJsonFilePath) {
    this.leagueJsonFilePath = leagueJsonFilePath;
    this.leagueJsFilePath = leagueJsFilePath;
    this.projectionsJsonFilePath = projectionsJsonFilePath;
  }

  /*
   * @Override (see TradeInputStorer)
   */
  saveTradeInput(tradeInput) {
    this.saveLeague(tradeInput.league);
    this.savePlayerProjections(tradeInput.playerProjections);
  }

  /*
   * @Override (see TradeInputStorer)
   */
  saveLeague(league) {
    // Read exisitng json and add this league to it, overriding exisiting data for this leagueId if it exists.
    var leaguesJson = fs.readFileSync(this.leagueJsonFilePath);
    var leagues = JSON.parse(leaguesJson);
    leagues[league.leagueId] = league;
    var newLeaguesJson = JSON.stringify(leagues, null, 2);

    // Write the updated json to a json file.
    fs.writeFile(this.leagueJsonFilePath, newLeaguesJson, 'utf8', (err) => {

    });

    // Also write to a js object for now for ease of using it in the front end app
    // Eventually, we should have the front end call a backend to get the data
    fs.writeFile(this.leagueJsFilePath, "const leagues = ", 'utf8', (err) => {
      fs.appendFile(this.leagueJsFilePath, newLeaguesJson, 'utf8', (err) => {
        fs.appendFile(this.leagueJsFilePath, "\nexport default leagues;", 'utf8', (err) => {

        });
      });
    });
  }

 /*
  * @Override (see TradeInputStorer)
  */
  savePlayerProjections(playerProjections) {
    var playerProjectionsJson = JSON.stringify(playerProjections, null, 2);

    // Write the updated json to a json file, overriding any existing data.
    fs.writeFile(this.projectionsJsonFilePath, playerProjectionsJson, 'utf8', (err) => {

    });
  }
}

export default FileBasedTradeInputStorer;