import _ from 'lodash';
import Player from '../model/player.js';

class Team {

  // Use this to parse the real teams after the draft.
  // TODO Factory.
  static buildFromServer(teamData, players) {
    console.log(teamData);
    
    var playersOnTeam = []
    _.each(teamData.players, (playerData) => {
      var player = players[playerData.id];
      playersOnTeam.push(player);
    });
    return new Team(teamData.id, teamData.nickname, playersOnTeam);
  }

  constructor(id, nickname, players) {
      this.id = id;
      this.nickname = nickname;
      this.players = players;
  }

  expectedPointsRestOfSeason(currentWeek, numWeeksInSeason) {
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
  calculateExpectedPointsForWeek(week, numWeeksInSeason, startingLineupSlots) {
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
            points += player.expectedPointsForWeek(week, numWeeksInSeason);
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
