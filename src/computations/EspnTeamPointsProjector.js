import _ from 'lodash';

/**
 * Project points for an espn team.
 */
class EspnTeamPointsProjector {

  /**
   *
   * @param {EspnPlayerPointsProjector} espnPlayerPointsProjector
   */
  constructor(espnPlayerPointsProjector) {
    this.espnPlayerPointsProjector = espnPlayerPointsProjector;
  }

  /**
   * Calculate the projected number of points that the Team will score the rest of the season.
   * Takes into account player bye weeks and league starting lineups.
   *
   * @param {Team team} The team to project
   * @param {int currentWeek} The current week (1 to numWeeksInSeason)
   *   - currentWeek is the week we are trying to project. Games have not occurred yet.
   * @param {int numWeeksInSeason} The total number of weeks in the season
   * @param {Map<String, int>} startingLineupSlots A map of positionId to numberOfPlayers in the starting lineup with that positionId
   * @return {float} The expected number of points that this Team will score in the rest of the season
   */
  calculateExpectedPointsRestOfSeason(team, currentWeek, numWeeksInSeason, startingLineupSlots) {
    var points = 0;
    _.each(_.range(currentWeek, numWeeksInSeason), (week) => {
      points += this.calculateExpectedPointsForWeek(team, week, numWeeksInSeason, startingLineupSlots);
    });
    return points;
  }

  /**
   * Calculate the projected number of points that tes Team will score in the given week.
   * For each week, we determine the starting lineup (Players[]) by choosing a subset of players from the Team's players.
   * We choose the starting lineup by filling all roster slots in order, picking the Player with the highest projected points for that week whose position satisfies that roster slot.
   *   NOTE: FLEX must be last member of startingLineupSlots for this algorithm to work.
   *
   * @param {Team team} The team to project
   * @param {int} week The week of interest (1 to numWeeksInSeason)
   * @param {int} numWeeksInSeason The total number of weeks in the season
   * @param {Map<String, int>} startingLineupSlots A map of positionId to numberOfPlayers in the starting lineup with that positionId
   * @return {float} The expected number of points that this Team will score in the given week.
   */
  calculateExpectedPointsForWeek(team, week, numWeeksInSeason, startingLineupSlots) {
    var bestPlayersThisWeek = _.sortBy(team.players, (player) => -this.espnPlayerPointsProjector.calculateExpectedPointsForWeek(player, week, numWeeksInSeason));
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
            points += this.espnPlayerPointsProjector.calculateExpectedPointsForWeek(player, week, numWeeksInSeason);
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
}

export default EspnTeamPointsProjector;