import fs from 'fs';
import _ from 'lodash';

import League from '../../model/league.js';
import Team from '../../model/team.js';
import Player from '../../model/player.js';

/**
 * A TradeInputRetriever that retrieves TradeInput data from the file system.
 */
class FileBasedTradeInputRetriever { /* implements TradeInputRetriever */

  /**
   * 
   * @param {String} jsonFilePath Path to the json file where the data should be stored
   */
  constructor(jsonFilePath) {
    this.jsonFilePath = jsonFilePath;
  }

  /**
   * @Override (see TradeInputRetriever)
   */
  loadLeague(leagueId, seasonId, currentWeek) {
    var leaguesJson = fs.readFileSync(this.jsonFilePath);
    var leagues = JSON.parse(leaguesJson);
    var leagueObj = leagues[leagueId];
    return Promise.resolve(
      new League(
        leagueObj.leagueId,
        leagueObj.seasonId,
        this._convertTeamsObjToTeams(leagueObj.teams),
        leagueObj.proIdToByeWeekMap,
        leagueObj.numWeeksInSeason,
        leagueObj.startingLineupSlots,
        leagueObj.maxLineupSlots
    ));
  }

  _convertTeamsObjToTeams(teamsObj) {
    return _.map(teamsObj, (teamObj) => (
      new Team(
        teamObj.id, 
        teamObj.nickname, 
        this._convertPlayersObjToPlayer(teamObj.players))
    ));
  }
  _convertPlayersObjToPlayer(playersObj) {
    return _.map(playersObj, (playerObj) => (
      new Player(
        playerObj.id, 
        playerObj.fullName, 
        playerObj.eligibleSlots,
        playerObj.proTeamId, 
        playerObj.byeWeek,
        playerObj.totalExpectedPoints2019)
    ));
  }
}

export default FileBasedTradeInputRetriever;