import _ from 'lodash';

/**
 * A Player represents an NFL player in a fantasy football league.
 * 
 * {String} id Espn's unique identifier for this player
 * {String} fullName The full name of this player (i.e. Antonio Brown)
 * {String[]} A list of strings that represent the fantasy football positions that this Player is eligible to be placed in. See constants.js
 * {String} proTeam Espn's unique identifier for the proTeam that this player is on
 * {String} byeWeek The index of the week that this player has a bye (no games).
 * {float} totalExpectedPoints2019 The projected number of points that this player will score in 2019
 *   - TODO this should be extracted to a different class and be indexed by current week (i.e. expectedPointsRestOfSeason)
 */
class Player {

  /**
   * Constructs a Player object based on data retrieved from the Espn client.
   * 
   * TODO Extract this to a Factory class.
   * 
   * @param {Object} playerData Data about the player retrieved from Espn
   * @param {Map<String, String>}  proTeamIdToByeWeekMap A map of proTeamId to byeWeek
   * @param {float} totalExpectedPoints2019 The projected number of points that this player will score in 2019
   * @return {Player}
   */
  static buildFromServer(playerData, proTeamIdToByeWeekMap, totalExpectedPoints2019) {
    // espn uses ints, i use string. todo decide which to use
    const eligibleSlots = _.map(playerData.player.eligibleSlots, (eligibleSlot) => eligibleSlot.toString());
    return new Player(playerData.id, playerData.player.fullName, eligibleSlots, playerData.onTeamId, proTeamIdToByeWeekMap[playerData.onTeamId].byeWeek, totalExpectedPoints2019);
  }

  constructor(id, fullName, eligibleSlots, proTeamId, byeWeek, totalExpectedPoints2019) {
      this.id = id;
      this.fullName = fullName;
      this.eligibleSlots = eligibleSlots;
      this.proTeamId = proTeamId;
      this.byeWeek = byeWeek;
      this.totalExpectedPoints2019 = totalExpectedPoints2019;
  }

  /**
   * Calculate the projected number of points that this Player will score in the given week.
   * @param {int} week The index of the week of interest (1 to numWeeksInSeason)
   * @param {int} numWeeksInSeason The total number of weeks in the season
   * @return {float} The expected number of points scored by the Player in the week
   */
  calculateExpectedPointsForWeek(week, numWeeksInSeason) {
    return week == this.byeWeek || week > numWeeksInSeason ? 0 : this.totalExpectedPoints2019 / numWeeksInSeason;
  }

  /**
   * Calculate the projected number of points that this Player will score in the rest of the season.
   * @param {int} currentWeek The index of the current week (1 to numWeeksInSeason)
   *   - currentWeek is the week we are trying to project. Games have not occurred yet.
   * @param {int} numWeeksInSeason The total number of weeks in the season
   * @return {float} The expected number of points scored by the Player in the rest of the season.
   */
  calculateExpectedPointsRestOfSeason(currentWeek, numWeeksInSeason) {
    const isByeWeekOver = this.byeWeek < currentWeek;
    const weeksRemaining = isByeWeekOver ? numWeeksInSeason - currentWeek : numWeeksInSeason - currentWeek - 1;
    return this.totalExpectedPoints2019 * weeksRemaining;
  }

  /**
   * Determine of this Player is eligible for the given roster slot.
   * @param {String} slot The id of the roster slot
   * @return {boolean} True of the roster slot is in the Player's eligibleSlots.
   */
  satisfiesStartingLineupSlot(slot) {
    return _.includes(this.eligibleSlots, slot);
  }

  toString() {
    return this.fullName;
  }
}

export default Player;
