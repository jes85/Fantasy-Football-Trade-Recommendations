import { Client } from 'espn-fantasy-football-api/node-dev';
import ExtendedClient from './client/client.js';
import _ from 'lodash';
// Not committing secrets to git. To run this program, create a file at path ./secrets/secrets.js and export these constants.
import { leagueId, espnS2, swid } from './secrets/secrets.js';


// I explored using Client from espn-fantasy-football-api/node-dev but it doesn't have everything I need. So I rolled my own ExtendedClient. 
// const myClient = new Client({ leagueId: leagueId });
// myClient.setCookies({ espnS2: espnS2, SWID: swid });

// http://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${this.leagueId}?view=mMatchup&view=mMatchupScore&scoringPeriodId=${scoringPeriodId}`
// http://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leagues/7538631?view=mMatchup&view=mMatchupScore&scoringPeriodId=1
// myClient.getBoxscoreForWeek({ seasonId: 2019, scoringPeriodId: 1, matchupPeriodId: 1 }).then((boxscores) => {
//   //console.log(boxscores);
//   _.each(boxscores, (boxscore) => {
//   	// console.log(boxscore.homeScore);
//   	// console.log(boxscore.homeTeamId);
//   	// console.log(boxscore.homeRoster);
//   });
// }).catch((error) => {
//   console.log(error)
// });

// // http://fantasy.espn.com/apis/v3/games/ffl/seasons/${seasonId}/segments/0/leagues/${this.leagueId}?scoringPeriodId=${scoringPeriodId}&view=kona_player_info
// // http://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leagues/7538631?scoringPeriodId=1&view=kona_player_info
// myClient.getFreeAgents({ seasonId: 2019, scoringPeriodId: 0 }).then((freeAgents) => {
//   //console.log(freeAgents);
//   _.each(freeAgents, (freeAgent) => {
//   	// console.log(freeAgent.player);
//   	// console.log(freeAgent.rawStats);
//   	// console.log(freeAgent.projectedRawStats);
//   });
// }).catch((error) => {
//   console.log(error)
// });


const myClient = new ExtendedClient({ leagueId: leagueId, espnS2: espnS2, SWID: swid });
// http://fantasy.espn.com/apis/v3/games/ffl/seasons/2019/segments/0/leagues/7538631?&view=kona_player_info
var teams = myClient.getTeams(2019).then(teams => {
  //console.log(teams);
  _.each(teams, (team) => {
  	console.log(team.id);
  	// console.log(team.nickname);
  	console.log(team.players);
  });
}).catch((error) => {
  console.log(error)
});
