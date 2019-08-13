import fs from 'fs';

const leaguesJsonFileName = '/Users/jeremyschreck/Developer/ff/src/testing/leagues.json';
const bestTradesJsonFileName = '/Users/jeremyschreck/Developer/ff/src/testing/bestTrades.json';

const leaguesJsFileName = '/Users/jeremyschreck/Developer/react/ff/src/data/leagues.js';
const bestTradesJsFileName = '/Users/jeremyschreck/Developer/react/ff/src/data/bestTrades.js';

class FileBasedTradeOutputDAO {

  loadTrades(leagueId, seasonId, weekId) {
    var leaguesData = fs.readFileSync(leaguesJsonFileName);
    var leagues = JSON.parse(leaguesData);
    var bestTradesData = fs.readFileSync(bestTradesJsonFileName);
    var bestTradesMap = JSON.parse(bestTradesData);

    return {
      league: leagues[leagueId],
      bestTrades: bestTradesMap[leagueId]
    };
  }

  saveTrades(league, bestTradesForLeague, currentWeek) {
    var bestTradesData = fs.readFileSync(bestTradesJsonFileName);
    var bestTradesAllLeagues = JSON.parse(bestTradesData);
    bestTradesAllLeagues[league.leagueId] = bestTradesForLeague;
    var bestTradesJson = JSON.stringify(bestTradesAllLeagues, null, 2);
    fs.writeFile(bestTradesJsonFileName, bestTradesJson, 'utf8', (err) => {

    });

    fs.writeFile(bestTradesJsFileName, "const bestTradesAllLeagues = ", 'utf8', (err) => {
      fs.appendFile(bestTradesJsFileName, bestTradesJson, 'utf8', (err) => {
        fs.appendFile(bestTradesJsFileName, "\nexport default bestTradesAllLeagues;", 'utf8', (err) => {

        });
      });
    });

   
    var leaguesData = fs.readFileSync(leaguesJsonFileName);
    var leagues = JSON.parse(leaguesData);
    leagues[league.leagueId] = league;
    var leaguesJson = JSON.stringify(leagues, null, 2);
    fs.writeFile(leaguesJsonFileName, leaguesJson, 'utf8', (err) => {

    });

    fs.writeFile(leaguesJsFileName, "const leagues = ", 'utf8', (err) => {
      fs.appendFile(leaguesJsFileName, leaguesJson, 'utf8', (err) => {
        fs.appendFile(leaguesJsFileName, "\nexport default leagues;", 'utf8', (err) => {

        });
      });
    });
  }

    

}

export default FileBasedTradeOutputDAO;