import parse from 'csv-parse/lib/sync';
import fs from 'fs';
import _ from 'lodash';
import { fantasyProsPlayerToEspnPlayerMap } from '../../constants.js';
import { projectionCsvs } from '../../configuration.js';

class CsvClientTradeInputRetriever {

  constructor() {
    this.csvs = projectionCsvs;
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
        //const fantasyProsPlayerName = record.Player;
        // record.PLAYER_FIRST/PLAYER_LAST = CBS sports player name
        const fantasyProsPlayerName = record.PLAYER_FIRST + " " + record.PLAYER_LAST;

        var espnPlayerName = fantasyProsPlayerName;
        if (fantasyProsPlayerToEspnPlayerMap[fantasyProsPlayerName]) {
          espnPlayerName = fantasyProsPlayerToEspnPlayerMap[fantasyProsPlayerName];
        }
        // record.FPTS = total projected points. TODO change this to avg points per week
        // hardcoding /16 for now (preseason);
        // playerProjections[espnPlayerName] = record.FPTS / 16.0;

        // This is ppg from cbs sports instead of ff pros. TODO this avg might already take into account bye week, so I shouldn't take it into account twice.
        playerProjections[espnPlayerName] = parseFloat(record.FPPG);
      });
    });
    return playerProjections;
  }
}

export default CsvClientTradeInputRetriever;