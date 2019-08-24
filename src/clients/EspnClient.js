import axios from 'axios';
import _ from 'lodash';

import Team from '../model/Team.js';
import Player from '../model/Player.js';
import ProTeam from '../model/ProTeam.js';

axios.defaults.baseURL = 'http://fantasy.espn.com/apis/v3/games/ffl/seasons/';

/**
 * A client that accesses data from the Espn Fantasy Football API.
 * 
 * String espnS2 The espnS2 cookie to use to authenticate to private leagues. Not required for public leagues.
 * String SWID The SWID cookie to use to authenticate to private leagues. Not required for public leagues.
 */
class EspnClient {
  constructor(espnS2 = null, SWID = null) {
    this.espnS2 = espnS2;
    this.SWID = SWID;
  }

  /////////////////////////////////////////////// Public Methods /////////////////////////////////////////////////////
 
  /**
   * Get a map of pro team id to bye week.
   * 
   * @param {String} seasonId Season id is in the endpoint required for some reason
   * @return {Map<String, String} The proTeamIdToByeWeekMap
   */
  getProTeamIdToByeWeekMap(seasonId) {
    return axios.get(this._getProTeamsRoute(seasonId), this._buildAxiosConfig()).then((response) => {
        const proTeamsData = response.data['settings']['proTeams'];
        var proTeamDataList = _.map(proTeamsData, (proTeamData) => (
          ProTeam.buildFromServer(proTeamData)
        ));
        return _.keyBy(proTeamDataList, (proTeam) => (
          proTeam.id 
        ));
    });
  }

  /**
   * Get a list of Players in the espn league for the given season.
   * 
   * @param {String} leagueId A unique identifier for the Espn Fantasy Football League
   * @param {String} seasonId 
   * @param {Map<String, String>} proTeamIdToByeWeekMap 
   * @return {Player[], Map<String, Player[]>} players, teamIdToPlayersMap
   */
  getPlayers(leagueId, seasonId, proTeamIdToByeWeekMap) {
    return axios.get(this._getPlayersRoute(leagueId, seasonId), this._buildAxiosConfig()).then((response) => {
      const playersData = _.get(response.data, 'players');
      const teamIdToPlayersMap = {};
      var players = [];
      _.each(playersData, (playerData) => {
        // Use totalRating as an estimate to total projected points for now
        // TODO get better projections
        var totalExpectedPoints2019 = 100;
        if (playerData.ratings) {
          totalExpectedPoints2019 = playerData.ratings['0'].totalRating;
        }
        const player = Player.buildFromServer(playerData, proTeamIdToByeWeekMap, totalExpectedPoints2019);
        players.push(player);
        if (!teamIdToPlayersMap[playerData.onTeamId]) {
          teamIdToPlayersMap[playerData.onTeamId] = [player];
        } else {
          teamIdToPlayersMap[playerData.onTeamId].push(player);
        }
      });
      return (players, teamIdToPlayersMap);
    });
  }

  /**
   * Get a list of Teams in the espn league for the given season.
   * 
   * @param {String} leagueId A unique identifier for the Espn Fantasy Football League
   * @param {String} seasonId 
   * @param {Map<String, Player[]>} players A map of teamId to list of all players on that team
   * @return {Team[]}
   */
  getTeams(leagueId, seasonId, teamIdToPlayersMap) {
    return axios.get(this._getTeamsRoute(leagueId, seasonId), this._buildAxiosConfig()).then((response) => {
        const teamsData = _.get(response.data, 'teams');
        return _.map(teamsData, (teamData) => (
          Team.buildFromServer(teamData, teamIdToPlayersMap)
        ));
    });
  }


  /////////////////////////////////////////////// Private Methods /////////////////////////////////////////////////////
  /**
   * Correctly builds an axios config with cookies, if set on the instance
   * @param  {object} config An axios config.
   * @return {object}        An axios config with cookies added if set on instance
   * @private
   */
  _buildAxiosConfig(config) {
    if ((this.espnS2 && this.SWID)) {
      const headers = { Cookie: `espn_s2=${this.espnS2}; SWID=${this.SWID};` };
      return _.merge({}, config, { headers, withCredentials: true });
    }

    return config;
  }

  /**
   * Get the route that returns pro team data.
   * Full endpoint: https://fantasy.espn.com/apis/v3/games/ffl/seasons/2019?view=proTeamSchedules
   * @param {String} seasonId 
   * @return {string} The route
   * @private
   */
  _getProTeamsRoute(seasonId) {
    const routeBase = `${seasonId}`;
    const routeParams = `?view=proTeamSchedules`;
    const route = `${routeBase}${routeParams}`;
    return route;
  }

  /**
   * Get the route that returns player data.
   * Full endpoint: https://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leagues/7538631?&view=kona_player_info
   * @param {String} leagueId A unique identifier for the Espn Fantasy Football League
   * @param {String} seasonId 
   * @return {string} The route
   * @private
   */
  _getPlayersRoute(leagueId, seasonId) {
    const routeBase = `${seasonId}/segments/0/leagues/${leagueId}`;
    const routeParams = `?view=kona_player_info`;
    const route = `${routeBase}${routeParams}`;
    return route;
  }

  /**
   * Get the route that returns team data.
   * Full endpoint: https://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leagues/7538631?&view=mTeam
   * @param {String} leagueId A unique identifier for the Espn Fantasy Football League
   * @param {String} seasonId 
   * @return {string} The route
   * @private
   */
  _getTeamsRoute(leagueId, seasonId) {
    const routeBase = `${seasonId}/segments/0/leagues/${leagueId}`;
    const routeParams = `?view=mTeam`;
    const route = `${routeBase}${routeParams}`;
    return route;
  }
}
export default EspnClient;