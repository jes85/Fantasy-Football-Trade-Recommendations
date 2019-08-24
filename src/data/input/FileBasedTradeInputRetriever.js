import fs from 'fs';
import _ from 'lodash';

import League from '../../model/League.js';
import Team from '../../model/Team.js';
import Player from '../../model/Player.js';

import CsvClient from '../../clients/CsvClient.js';

/**
 * A TradeInputRetriever that retrieves TradeInput data from the file system.
 */
class FileBasedTradeInputRetriever { /* implements TradeInputRetriever */

  /**
   * 
   * @param {String} jsonFilePath Path to the json file where the data should be stored
   */
  constructor(jsonFilePath, csvClient) {
    this.jsonFilePath = jsonFilePath;
    this.csvClient = csvClient;
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
    
    return _.map(playersObj, (playerObj) => {
      var projectedPoints = this.csvClient.getProjectedPoints(playerObj.fullName);
      if (!projectedPoints) {
        projectedPoints = playerObj.totalExpectedPoints2019;
        console.log(`Setting expected points for ${playerObj.fullName} to ${playerObj.totalExpectedPoints2019}`);

      }
      return new Player(
        playerObj.id, 
        playerObj.fullName, 
        playerObj.eligibleSlots,
        playerObj.proTeamId, 
        playerObj.byeWeek,
        projectedPoints);
      });
  }
}

export default FileBasedTradeInputRetriever;