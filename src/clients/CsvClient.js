//import parse from 'csv-parse';
import parse from 'csv-parse/lib/sync';
import fs from 'fs';
import _ from 'lodash';
/**
 * Reads csv files from fantasy pros. It's not really a "client" but I'm putting it here for now
 * because it achieves the same as the EspnClient in downloading data needed to construct TradeInput data.
 */
class CsvClient {
  constructor() {
    this.playerMap = {};
  }
  getPlayers(seasonId) {
    const csvs = [
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_QB.csv',
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_RB.csv',
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_WR.csv',
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_TE.csv',
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_DST.csv',
      '/Users/jeremyschreck/Downloads/FantasyPros_Fantasy_Football_Projections_K.csv'
    ];
    _.each(csvs, (csv) => {
      const playersCsv = fs.readFileSync(csv);
      const parseOptions = {
        columns: true
      };
      const records = parse(playersCsv, parseOptions);
      _.each(records, (record) => {
        this.playerMap[record.Player] = record;
      });
    });
  }

  getProjectedPoints(espnPlayerName) {
    var fantasyProsPlayer = this.playerMap[espnPlayerName];
    if (fantasyProsPlayer) {
      console.log(`Setting expected points for ${espnPlayerName} to ${fantasyProsPlayer.FPTS}`);
      return fantasyProsPlayer.FPTS;
    } else {
      console.error("No fantasyPro player named " + espnPlayerName);
      return null;
    }
  }

  cleansePlayerName(name) {
    // Pseudocode

    // // Some include these, some don't. Let's remove all that do.
    // const suffixesToRemove = ["D/ST", " Jr.", " JR", " J.R.", " II", " III", " IV", " V"];
    // _each(suffixesToRemove, (suffixToRemove) => {
    //   if (name.endsWith(suffixToRemove)) {
    //     return name.split(suffixToRemove)[0];
    //   }
    // })
   
    // // Some include periods in initials, some don't. Let's remove all that do.
    // const initialsRegex = <a-z>(.)<a-z>(.);
    // if (name.beginsWith(initialsRegex)) {
    //   var tmp = name.match(initialsRegex);
    //   const initials = tmp[0].stripPeriods();
    //   const other = tmp[1];
    //   return initials + other;
    // }

    // return name;



  }
}

export default CsvClient;