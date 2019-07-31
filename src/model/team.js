import _ from 'lodash';
import Player from '../model/player.js';
import { numWeeksInSeason, startingLineupSlots, maxLineupSlots} from '../constants/constants.js';

class Team {

  // Use this to parse the real teams after the draft
  static buildFromServer(teamData, playersData) {
    var players = []
    _.each(playersData, (playerData) => {
      if (playersData["onTeamId"] == teamData.id) {
        players.push(Player.buildFromServer(playerData.player));
      }
        });
    return new Team(teamData.id, teamData.nickname, players);
  }

  // Use this to create fake teams before the draft
  // TODO this should probably live somewhere else
  // Assign teams by randomly assigning each position
  static buildFromFakeServer(teamData, players, teamIndex, totalTeams) {
    var playersOnTeam = []
    var playersByPosition = {};
    _.each(startingLineupSlots, (numNeeded, startingLineupSlot) => {
      //console.log(startingLineupSlot);
      playersByPosition[startingLineupSlot] = [];
    });
    //console.log(playersByPosition);
    var bestPlayers = _.sortBy(players, (player) => -player.totalExpectedPoints2019);
    var randomPlayers = _.shuffle(players);
    var randomBestPlayers = _.shuffle(bestPlayers.slice(0, totalTeams*20));

    _.each(randomBestPlayers, (player) => {
      //console.log(player.eligibleSlots);
      //console.log(player.satisfiesStartingLineupSlot('0'));
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
        //console.log("uhoh");
      }
    });
    //console.log(playersByPosition);
    _.each(playersByPosition, (players, startingLineupSlot) => {
      var i = 0;
      var numPlayersThisPositionOnTeam = 0;
      var maxPlayersThisPositionOnTeam = maxLineupSlots[startingLineupSlot];
      _.find(players, (player) => {
        if ((i % totalTeams) == teamIndex) {
          playersOnTeam.push(player);
          numPlayersThisPositionOnTeam++;
          //console.log(player);
        }
        i++;
        return numPlayersThisPositionOnTeam >= maxPlayersThisPositionOnTeam;
      });
        });
        // todo validate roster
    return new Team(teamData.id, teamData.nickname, playersOnTeam);
  }

  constructor(id, nickname, players) {
      this.id = id;
      this.nickname = nickname;
      this.players = players;
  }

  expectedPointsRestOfSeason(currentWeek) {
    var points = 0;
    _.each(_.range(currentWeek, numWeeksInSeason), (week) => {
      points += this.calculateExpectedPointsForWeek(week);
    });
    return points;
  }

  /**
   * This constructs a starting lineup by filling all roster slots in order, picking player with highest projected points whose position satisfies that rosterslot
   * FLEX must be last member of startingLineupSlots
   */
  calculateExpectedPointsForWeek(week) {
    var bestPlayersThisWeek = _.sortBy(this.players, (player) => -player.expectedPointsForWeek(week));
    var startingLineup = [];
    var points = 0;
    _.each(startingLineupSlots, (numNeeded, startingLineupSlot) => {
      _.each(_.range(numNeeded), (iteration) => {
        var isSatisfied = false;
        _.find(bestPlayersThisWeek, (player) => {
          if (player.satisfiesStartingLineupSlot(startingLineupSlot)) {
            isSatisfied = true;
            bestPlayersThisWeek = _.without(bestPlayersThisWeek, player);
            startingLineup.push(player);
            points += player.expectedPointsForWeek(week);
            return true; // breaks out of loop
          }
          return false;
        });

        if (!isSatisfied) {
          //throw "Team contains no valid starting lineup";
          return -10000;
        }
      });
    });
    return points;
  }

  afterTrade(playersToRemove, playersToAdd) {
    //var newPlayers = _.without(this.players, ...playersToRemove);
    var newPlayers = _.union(_.without(this.players, ...playersToRemove), playersToAdd);
    return new Team(this.id, this.nickname, newPlayers);
  }

  toString() {
    return `{\n` +
      `Team id: ${this.id}\n` +
      `Team name: ${this.nickname}\n` +
      `Players:\n ${_.map(this.players, (player) => player.toString())}}` +
    `}`;
    }

  // validateRoster() {
  // 	_.each(League.rosterSlots, (rosterSlot) => {
  // 		_.each(this.players, (player) => {
  // 			if (!player.satisfiesRosterSlot(rosterSlot)) {
  // 				return false;
  // 			} 
  // 		});
 //        });
 //        return true;
  // }
}

export default Team;
