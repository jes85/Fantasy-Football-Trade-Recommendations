import _ from 'lodash';
// todo retrieve these from espn league instead of constants.
import { numWeeksInSeason, startingLineupSlots, maxLineupSlots } from '../../constants/constants.js';
import League from '../../model/league.js';
import Team from '../../model/team.js';

/**
 * A TradeInputRetiever that access input data by pulling the data directly 
 * from the given client.
 */
class EspnClientTradeInputRetriever {

  constructor(espnClient) {
    this.espnClient = espnClient;
  }

  /**
   * Public Methods.
   */
  loadLeague(seasonId, currentWeek) {
    // todo if this is to be extended to other leagues/clients that aren't espn,
    // the proTeamIdToByeWeekMap should be abstracted.
    return this.espnClient.getProTeamIdToByeWeekMap(seasonId).then((proTeamIdToByeWeekMap) => {
      return this.espnClient.getPlayers(seasonId, proTeamIdToByeWeekMap).then((players) => {
        return this.espnClient.getTeams(seasonId, players, proTeamIdToByeWeekMap).then((teams) => {
          console.log(teams);
          // If it's before the draft, assign random teams to each member of the league.
          if (currentWeek == 0) {
            teams = this.assignPlayersToTeams(teams, players);
          }
          console.log(teams);
          //console.log(players);
          return new League(
            seasonId, 
            players, 
            teams, 
            proTeamIdToByeWeekMap,
            numWeeksInSeason,
            startingLineupSlots,
            maxLineupSlots);
        });
      });
    });
  }

  /**
   * Private Methods
   */

  /**
   * Assign teams by randomly assigning each position.
   * 
   * TODO refactor now that I moved this.
   */
  assignPlayersToTeams(teamsWithoutPlayersAssigned, allPlayers) {
    var teamsWithPlayersAssigned = [];
    _.each(teamsWithoutPlayersAssigned, (team, teamIndex) => {
      var playersOnTeam = []
      var playersByPosition = {};

      _.each(startingLineupSlots, (numNeeded, startingLineupSlot) => {
        playersByPosition[startingLineupSlot] = [];
      });

      var bestPlayers = _.sortBy(allPlayers, (player) => -player.totalExpectedPoints2019);
      var randomPlayers = _.shuffle(bestPlayers);
      var randomBestPlayers = _.shuffle(bestPlayers.slice(0, teamsWithoutPlayersAssigned.length*20));

      // todo clean up
      _.each(randomBestPlayers, (player) => {
        if (player.satisfiesStartingLineupSlot('0')) {
          playersByPosition['0'].push(player);
        } else if (player.satisfiesStartingLineupSlot('2')) {
          playersByPosition['2'].push(player);
        } else if (player.satisfiesStartingLineupSlot('4')) {
          playersByPosition['4'].push(player);
        } else if (player.satisfiesStartingLineupSlot('6')) {
          playersByPosition['6'].push(player);
        } else if (player.satisfiesStartingLineupSlot('16')) {
          playersByPosition['16'].push(player);
        } else if (player.satisfiesStartingLineupSlot('17')) {
          playersByPosition['17'].push(player);
        } else {
          throw "There's a player whose position we don't handle correctly."
        }
      });

      _.each(playersByPosition, (players, startingLineupSlot) => {
        var i = 0;
        var numPlayersThisPositionOnTeam = 0;
        var maxPlayersThisPositionOnTeam = maxLineupSlots[startingLineupSlot];
        _.find(players, (player) => {
          if ((i % teamsWithoutPlayersAssigned.length) == teamIndex) {
            playersOnTeam.push(player);
            numPlayersThisPositionOnTeam++;
            //console.log(player);
          }
          i++;
          return numPlayersThisPositionOnTeam >= maxPlayersThisPositionOnTeam;
        });
      });
      // todo validate roster
      teamsWithPlayersAssigned.push(new Team(team.id, team.nickname, playersOnTeam));
    })
    return teamsWithPlayersAssigned;
  }
}

export default EspnClientTradeInputRetriever;