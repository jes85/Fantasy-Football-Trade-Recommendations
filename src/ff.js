import ExtendedClient from './client/client.js';
import _ from 'lodash';
// Not committing secrets to git. To run this program, create a file at path ./secrets/secrets.js and export these constants.
import { leagueId, espnS2, swid } from './secrets/secrets.js';
import { numWeeksInSeason, seasonId, startingLineupSlots } from './constants/constants.js';
import League from './league/league.js';

const espnClient = new ExtendedClient({ leagueId: leagueId, espnS2: espnS2, SWID: swid });
const league = new League(numWeeksInSeason, startingLineupSlots);
const currentWeek = 1;

espnClient.getProTeamIdToByeWeekMap(seasonId).then((proTeamIdToByeWeekMap) => {
  //console.log(proTeamIdToByeWeekMap);
  espnClient.getPlayers(seasonId, proTeamIdToByeWeekMap).then((players) => {
    //console.log(players);
    espnClient.getTeams(seasonId, players, proTeamIdToByeWeekMap).then((teams) => {
      printTeams(teams);
      var trades = league.getAllTrades(currentWeek, teams);
      console.log("Total trades: " + trades.length);
      var bestTradesMap = sortTrades(trades, teams);
      console.log("Total viable trades: " + bestTradesMap["overall"].length);
      printBestTrades(bestTradesMap);
    });
  });
});

function printTeams(teams) {
  console.log(`Teams:\n\n ${_.map(teams, (team) => team.toString())}`);
}

/**
 * 
  {
    "overall": [],
    "byTeam": {
      1: [], // key = teamId
      2: [].
    }
  }
 */
function sortTrades(trades, teams) {
  var bestTradesMap = {};
  // Filture all trades that are definitely bad (negative scores)
  var viableTrades = _.filter(trades, (trade) => trade.overallTradeScore > 0);

  // Sort by descending score (best scores first).
  var bestOverallTrades = _.sortBy(viableTrades, (trade) => -trade.overallTradeScore);
  bestTradesMap["overall"] = bestOverallTrades;

  var bestTradesByTeamMap = {};
  _.each(teams, (team) => {
    var tradesWithTeam = _.filter(viableTrades, (trade) => trade.includesTeam(team));
    var bestTradesForTeam = _.sortBy(tradesWithTeam, (trade) => -trade.tradeScoreForTeam(team));
    bestTradesByTeamMap[team.id] = bestTradesForTeam;
  });
  bestTradesMap["byTeam"] = bestTradesByTeamMap;

  return bestTradesMap;
}

function printBestTrades(bestTradesMap) {
  console.log(`best overall trades: ${_.map(bestTradesMap['overall'], (trade) => trade.toString())}\n.`);
  _.each(bestTradesMap['byTeam'], (trades, teamId) => {
    console.log(`best trades for team ${teamId} (${trades.length} total): ${_.map(trades, (trade) => trade.toString())}\n.`);
  });
}
