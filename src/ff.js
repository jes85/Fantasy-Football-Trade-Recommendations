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
  			_.each(teams, (team) => {
  				console.log(team.id);
  				console.log(team.nickname);
  				_.each(team.players, (player) => {
  					console.log(player.fullName);
  					//console.log(player.eligibleSlots);
  				})
  			});
  			league.calculateBestTrades(currentWeek, teams);
		});
	});
});


