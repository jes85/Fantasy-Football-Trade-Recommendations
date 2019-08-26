import _ from 'lodash';

/**
 * A Player represents an NFL player in a fantasy football league.
 *
 * {String} id Espn's unique identifier for this player
 * {String} fullName The full name of this player (i.e. Antonio Brown)
 * {String[]} A list of strings that represent the fantasy football positions that this Player is eligible to be placed in. See constants.js
 * {String} proTeam Espn's unique identifier for the proTeam that this player is on
 * {String} byeWeek The index of the week that this player has a bye (no games).
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
  static buildFromServer(playerData, proTeamIdToByeWeekMap) {
    // espn uses ints, i use string. todo decide which to use
    const eligibleSlots = _.map(playerData.player.eligibleSlots, (eligibleSlot) => eligibleSlot.toString());
    return new Player(playerData.id, playerData.player.fullName, eligibleSlots, playerData.player.proTeamId, proTeamIdToByeWeekMap[playerData.player.proTeamId].byeWeek);
  }

  constructor(id, fullName, eligibleSlots, proTeamId, byeWeek) {
      this.id = id;
      this.fullName = fullName;
      this.eligibleSlots = eligibleSlots;
      this.proTeamId = proTeamId;
      this.byeWeek = byeWeek;
  }

  /**
   * Determine if this Player is eligible for the given roster slot.
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
