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
   * @param {String} leagueJsonFilePath Path to the json file where the league data are stored
   * @param {String} projectionsJsonFilePath Path to the json file where the player projections are stored
   */
  constructor(leagueJsonFilePath, projectionsJsonFilePath) {
    this.leagueJsonFilePath = leagueJsonFilePath;
    this.projectionsJsonFilePath = projectionsJsonFilePath;
  }

  /**
   * @Override (see TradeInputRetriever)
   */
  loadTradeInput(leagueId, seasonId, currentWeek) {
    return new TradeInput(this.loadLeague(leagueId, seasonId, currentWeek), this.loadPlayerProjections(currentWeek));
  }

  /**
   * @Override (see TradeInputRetriever)
   */
  loadLeague(leagueId, seasonId, currentWeek) {
    var leaguesJson = fs.readFileSync(this.leagueJsonFilePath);
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

  /**
   * @Override (see TradeInputRetriever)
   */
  loadPlayerProjections(seasonId, currentWeek) {
    var playerProjectionsJson = fs.readFileSync(this.projectionsJsonFilePath);
    var playerProjections = JSON.parse(playerProjectionsJson);
    return playerProjections;
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
      return new Player(
        playerObj.id,
        playerObj.fullName,
        playerObj.eligibleSlots,
        playerObj.proTeamId,
        playerObj.byeWeek);
      });
  }
}

export default FileBasedTradeInputRetriever;