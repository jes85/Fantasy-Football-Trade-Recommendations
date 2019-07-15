import { Client } from 'espn-fantasy-football-api/node-dev';
import axios from 'axios';
import _ from 'lodash';
import Team from '../team/team.js'

axios.defaults.baseURL = 'http://fantasy.espn.com/apis/v3/games/ffl/seasons/';

class ExtendedClient {
  constructor(options) {
    // todo inject this instead of new
    this.leagueId = options.leagueId;
    this.client = new Client({ leagueId: options.leagueId });
    this.client.setCookies({ espnS2: options.espnS2, SWID: options.SWID });   
  }

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
  /**
   * Returns all teams in the ff league.
   * @return {Team[]}
   */
  getTeams(seasonId) {
    return axios.get(this.getPlayersRoute(seasonId), this.client._buildAxiosConfig()).then((response) => {
      //console.log(response.data);
      const playersData = _.get(response.data, 'players');
      // console.log(playersData);
      return axios.get(this.getTeamsRoute(seasonId), this.client._buildAxiosConfig()).then((response) => {
        const teamsData = _.get(response.data, 'teams');
        // console.log(teamsData);   
        return _.map(teamsData, (teamData, index) => (
          Team.buildFromFakeServer(teamData, playersData, index, teamsData.length)
        ));
      });
    });
  }
}

export default ExtendedClient;