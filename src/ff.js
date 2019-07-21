import ExtendedClient from './client/client.js';
import _ from 'lodash';
// Not committing secrets to git. To run this program, create a file at path ./secrets/secrets.js and export these constants.
import { leagueId, espnS2, swid } from './secrets/secrets.js';
import League from './league/league.js';

const seasonId = 2019;
const numWeeks = 16;
const currentWeek = 1;
// 1 QB, 2 RB, 2 WR, 1 TE, 1 D/ST, 1 K, 1 RB/WR/TE (Flex)
const startingLineupSlots = {'0': 1, '2': 2, '4': 2, '6': 1, '16': 1, '17': 1, '23': 1};

const espnClient = new ExtendedClient({ leagueId: leagueId, espnS2: espnS2, SWID: swid });
const league = new League(numWeeks, startingLineupSlots);

espnClient.getProTeamIdToByeWeekMap(seasonId).then((proTeamIdToByeWeekMap) => {
	//console.log(proTeamIdToByeWeekMap);
	espnClient.getPlayers(seasonId, proTeamIdToByeWeekMap).then((players) => {
		//console.log(players);
		espnClient.getTeams(seasonId, players, proTeamIdToByeWeekMap).then((teams) => {
  			//console.log(teams);
  			league.calculateBestTrades(currentWeek, teams);
		});
	});
});
