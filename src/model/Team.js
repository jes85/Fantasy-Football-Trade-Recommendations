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
   * @param {Map<String, Player[]>} A Map of teamId to a list of all players on that team
   * @return {Team}
   */
  static buildFromServer(teamData, teamIdToPlayersMap) {

    if (!teamIdToPlayersMap[teamData.id]) {
      console.warn(`No players from espn for team id${teamData.id}. This is only expected if it is pre-draft (currentWeek = 0). `);
      teamIdToPlayersMap[teamData.id] = [];
    }
    return new Team(teamData.id, teamData.location + " " + teamData.nickname, teamIdToPlayersMap[teamData.id]);
  }

  constructor(id, nickname, players) {
      this.id = id;
      this.nickname = nickname;
      this.players = players;
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
