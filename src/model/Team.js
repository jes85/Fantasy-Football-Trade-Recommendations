import _ from 'lodash';
import Player from './Player.js';

/**
 * A Team represents a team in a fantasy football league.
 *
 * {String} id The id of the team
 * {String} nickname The nickname of the team
 * {Player[]} players A list of Players on the team
 */
class Team {

  /**
   * Constructs a Team object based on data retrieved from the Espn client.
   * Use this to parse the real teams after the draft.
   * 
   * TODO Extract this to a Factory class.
   * 
   * @param {Object} teamData Data about the team retrieved from Espn
   * @param {Map<String, Player>} A Map of PlayerId to Player for all Players in the league
   * @return {Team} 
   */
  static buildFromServer(teamData, players) {
    
    var playersOnTeam = []
    _.each(teamData.players, (playerData) => {
      var player = players[playerData.id];
      playersOnTeam.push(player);
    });
    return new Team(teamData.id, teamData.location + " " + teamData.nickname, playersOnTeam);
  }

  constructor(id, nickname, players) {
      this.id = id;
      this.nickname = nickname;
      this.players = players;
  }

  /**
   * Calculate the projected number of points that this Team will score the rest of the season.
   * Takes into account player bye weeks and league starting lineups.
   * @param {int currentWeek} The current week (1 to numWeeksInSeason)
   *   - currentWeek is the week we are trying to project. Games have not occurred yet.
   * @param {int numWeeksInSeason} The total number of weeks in the season
   * @param {Map<String, int>} startingLineupSlots A map of positionId to numberOfPlayers in the starting lineup with that positionId
   * @return {float} The expected number of points that this Team will score in the rest of the season
   */
  calculateExpectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) {
    var points = 0;
    _.each(_.range(currentWeek, numWeeksInSeason), (week) => {
      points += this.calculateExpectedPointsForWeek(week, numWeeksInSeason, startingLineupSlots);
    });
    return points;
  }

  /**
   * Calculate the projected number of points that this Team will score in the given week. 
   * For each week, we determine the starting lineup (Players[]) by choosing a subset of players from the Team's players.
   * We choose the starting lineup by filling all roster slots in order, picking the Player with the highest projected points for that week whose position satisfies that roster slot.
   *   NOTE: FLEX must be last member of startingLineupSlots for this algorithm to work.
   * 
   * @param {int} week The week of interest (1 to numWeeksInSeason)
   * @param {int} numWeeksInSeason The total number of weeks in the season
   * @param {Map<String, int>} startingLineupSlots A map of positionId to numberOfPlayers in the starting lineup with that positionId
   * @return {float} The expected number of points that this Team will score in the given week.
   */
  calculateExpectedPointsForWeek(week, numWeeksInSeason, startingLineupSlots) {
    var bestPlayersThisWeek = _.sortBy(this.players, (player) => -player.calculateExpectedPointsForWeek(week));
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
            points += player.calculateExpectedPointsForWeek(week, numWeeksInSeason);
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

  /**
   * Create a shallow copy of this team but with different players.
   * This is a helper method used when creating potential Trades to evaluate. 
   * 
   * @param {Player[]} playersToRemove 
   * @param {Player[]} playersToAdd
   * @Return {Team} A new Team object that's the same as this Team, but without playersToRemove and with playersToAdd.
   */
  afterTrade(playersToRemove, playersToAdd) {
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
}

export default Team;
