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
			var bestTradesMap = sortTrades(trades);
			console.log("Total viable trades: " + bestTradesMap.length);
			printBestTrades(bestTradesMap);
		});
	});
});

function printTeams(teams) {
	console.log(`Teams:\n\n ${_.map(teams, (team) => team.toString())}`);
}

// todo create map
function sortTrades(trades) {
	// Filture all trades that are definitely bad (negative scores), and sort by descending score (best scores first).
	var bestTrades = _.sortBy(_.filter(trades, (trade) => trade.overallTradeScore > 0), (trade) => -trade.overallTradeScore);
	//var bestTrades = _.sortBy(trades, (trade) => -trade.overallTradeScore);
	return bestTrades;
}

function printBestTrades(bestTradesMap) {
	console.log(`best trades: ${_.map(bestTradesMap, (trade) => trade.toString())}.`);
}
