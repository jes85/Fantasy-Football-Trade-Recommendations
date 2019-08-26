import parse from 'csv-parse/lib/sync';
import fs from 'fs';
import _ from 'lodash';
import { fantasyProsPlayerToEspnPlayerMap } from '../../constants.js'

class CsvClientTradeInputRetriever {

  constructor() {
    this.csvs = [
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_QB.csv',
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_RB.csv',
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_WR.csv',
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_TE.csv',
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_DST.csv',
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_K.csv'
    ];
  }

  loadTradeInput(leagueId, seasonId, currentWeek) {
    // todo
  }

  loadLeague(leagueId, seasonId, currentWeek) {
    //todo
  }

  loadPlayerProjections(seasonId, currentWeek) {
    var playerProjections = {};
    _.each(this.csvs, (csv) => {
      const playersCsv = fs.readFileSync(csv);
      const parseOptions = {
        columns: true
      };
      const records = parse(playersCsv, parseOptions);
      _.each(records, (record) => {
        // record.Player = Fantasy Pros player name
        const fantasyProsPlayerName = record.Player;
        var espnPlayerName = fantasyProsPlayerName;
        if (fantasyProsPlayerToEspnPlayerMap[fantasyProsPlayerName]) {
          espnPlayerName = fantasyProsPlayerToEspnPlayerMap[fantasyProsPlayerName];
        }
        // record.FPTS = total projected points. TODO change this to avg points per week
        // hardcoding /16 for now (preseason);
        playerProjections[espnPlayerName] = record.FPTS / 16.0;
      });
    });
    return playerProjections;
  }
}

export default CsvClientTradeInputRetriever;