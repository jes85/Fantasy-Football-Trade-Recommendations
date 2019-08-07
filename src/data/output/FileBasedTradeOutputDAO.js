import fs from 'fs';

class FileBasedTradeOutputDAO {

  loadTrades(leagueId, seasonId, weekId) {
    // todo
    var leagueData = fs.readFileSync('league.json');
    var league = JSON.parse(leagueData);
    var bestTradesData = fs.readFileSync('bestTrades.json');
    var bestTradesMap = JSON.parse(bestTradesData);

    console.log(league);
    console.log(bestTradesMap);
  }

  saveTrades(league, bestTradesMap, currentWeek) {
    // todo 
    var bestTradesJson = JSON.stringify(bestTradesMap, null, 2);
    fs.writeFile('bestTrades.json', bestTradesJson, 'utf8', (err) => {

    });

    var leagueJson = JSON.stringify(league, null, 2);
    fs.writeFile('league.json', leagueJson, 'utf8', (err) => {

    });
  }

}

export default FileBasedTradeOutputDAO;