import _ from 'lodash';

/**
 * Project points for an espn player.
 */
class EspnPlayerPointsProjector {

  /**
   * @param {Map<String, float>} playerProjections Map of player to projected points per week
   */
  constructor(playerProjections) {
    this.playerProjections = playerProjections;
  }

  /**
   * Calculate the projected number of points that this Player will score in the given week.
   *
   * @param {Player} player The player to project points for
   * @param {int} week The index of the week of interest (1 to numWeeksInSeason)
   * @return {float} The expected number of points scored by the Player in the week
   */
  calculateExpectedPointsForWeek(player, week, numWeeksInSeason) {
    return ((week == player.byeWeek) || (week > numWeeksInSeason)) ? 0 : this._getPlayerProjectedPointsPerWeek(player);
  }

  /**
   * Calculate the projected number of points that this Player will score in the rest of the season.
   *
   * @param {Player} player The player to project points for
   * @param {int} currentWeek The index of the current week (1 to numWeeksInSeason)
   *   - currentWeek is the week we are trying to project. Games have not occurred yet.
   * @param {int} numWeeksInSeason The total number of weeks in the season
   * @return {float} The expected number of points scored by the Player in the rest of the season.
   */
  calculateExpectedPointsRestOfSeason(player, currentWeek, numWeeksInSeason) {
    const isByeWeekOver = this.byeWeek < currentWeek;
    const weeksRemaining = isByeWeekOver ? numWeeksInSeason - currentWeek : numWeeksInSeason - currentWeek - 1;
    return this._getPlayerProjectedPointsPerWeek(player) * weeksRemaining;
  }

  /**
   * @param {Player} player The player to project points for
   * @return float Projected points per week for this player
   */
  _getPlayerProjectedPointsPerWeek(player) {
    return _.has(this.playerProjections, player.fullName) ? this.playerProjections[player.fullName] : 0;
  }
}

export default EspnPlayerPointsProjector;