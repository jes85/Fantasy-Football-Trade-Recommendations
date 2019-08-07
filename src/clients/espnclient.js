import { Client } from 'espn-fantasy-football-api/node-dev';
import axios from 'axios';
import _ from 'lodash';
import Team from '../model/team.js';
import Player from '../model/player.js';
import ProTeam from '../model/proTeam.js';

axios.defaults.baseURL = 'http://fantasy.espn.com/apis/v3/games/ffl/seasons/';

class EspnClient {
  constructor(options) {
    // todo inject this instead of new
    this.leagueId = options.leagueId;
    this.client = new Client({ leagueId: options.leagueId });
    this.client.setCookies({ espnS2: options.espnS2, SWID: options.SWID });   
  }

  getTeams(seasonId, players, proTeamIdToByeWeekMap) {
    return axios.get(this.getTeamsRoute(seasonId), this.client._buildAxiosConfig()).then((response) => {
        const teamsData = _.get(response.data, 'teams');
        return _.map(teamsData, (teamData) => (
          Team.buildFromServer(teamData, players)
        ));
    });
  }

  getPlayers(seasonId, proTeamIdToByeWeekMap) {
    return axios.get(this.getPlayersRoute(seasonId), this.client._buildAxiosConfig()).then((response) => {
        const playersData = _.get(response.data, 'players');
        return _.map(playersData, (playerData) => {
          // Use totalRating as an estimate to total projected points for now
          // TODO get better projections
          var totalExpectedPoints2019 = 100;
          if (playerData.ratings) {
            totalExpectedPoints2019 = playerData.ratings['0'].totalRating;
          }
          return Player.buildFromServer(playerData, proTeamIdToByeWeekMap, totalExpectedPoints2019);
      });
    });
  }

  getProTeamIdToByeWeekMap(seasonId) {
    return axios.get(this.getProTeamsRoute(seasonId), this.client._buildAxiosConfig()).then((response) => {
        const proTeamsData = response.data['settings']['proTeams'];
        const totalExpectedPoints2019 = 200; // TODO
        var proTeamDataList = _.map(proTeamsData, (proTeamData) => (
          ProTeam.buildFromServer(proTeamData)
        ));
        return _.keyBy(proTeamDataList, (proTeam) => (
          proTeam.id 
        ));
    });
  }

  /**
   * Private methods.
   */
  // http://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leagues/7538631?&view=mTeam
  getTeamsRoute(seasonId) {
    const routeBase = `${seasonId}/segments/0/leagues/${this.leagueId}`;
    const routeParams = `?view=mTeam`;
    const route = `${routeBase}${routeParams}`;
    return route;
  }

  // http://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leagues/7538631?&view=kona_player_info
  getPlayersRoute(seasonId) {
    const routeBase = `${seasonId}/segments/0/leagues/${this.leagueId}`;
    const routeParams = `?view=kona_player_info`;
    const route = `${routeBase}${routeParams}`;
    return route;
  }

  // https://fantasy.espn.com/apis/v3/games/ffl/seasons/2019?view=proTeamSchedules
  getProTeamsRoute(seasonId) {
    const routeBase = `${seasonId}`;
    const routeParams = `?view=proTeamSchedules`;
    const route = `${routeBase}${routeParams}`;
    return route;
  }
}
export default EspnClient;