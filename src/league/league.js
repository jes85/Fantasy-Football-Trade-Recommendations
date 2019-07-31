import _ from 'lodash';
import Trade from '../trade/trade.js';

class League {
    constructor(numWeeksInSeason, startingLineupSlots) {
      this.numWeeksInSeason = numWeeksInSeason;
      this.startingLineupSlots = startingLineupSlots;
  }

  // TODO these trade methods probably don't belong in "League"
  getAllTrades(currentWeek, teams) {
    var trades = [];
    _.each(teams, (team, i) => {
      // Don't need to calculate trades twice.
      var otherTeams = teams.slice(i + 1, teams.length);
      trades = trades.concat(this.getAllTradesForTeam(team, otherTeams, currentWeek));
    });
    return trades;
  }

  getAllTradesForTeam(team, otherTeams, currentWeek) {
    var trades = [];
    _.each(otherTeams, (otherTeam) => {
      var all1v1Trades = this.getAll1v1Trades(team, otherTeam, currentWeek); // getAllnvmTrades(Team1, Team2, 1, 1)

      var all2v2Trades = this.getAll2v2Trades(team, otherTeam, currentWeek); // getAllnvmTrades(Team1, Team2, 2, 2)

      var all2v1Trades = this.getAll2v1Trades(team, otherTeam, currentWeek);

      var all1v2Trades = this.getAll2v1Trades(otherTeam, team, currentWeek);

      // # 3v3 trades
      // var all3v3Trades = getAllnvmTrades(Team1, Team2, 3, 3)
        trades = trades.concat(all1v1Trades).concat(all2v2Trades).concat(all2v1Trades).concat(all1v2Trades);
    });
    return trades;
  }

  getAll1v1Trades(team1, team2, currentWeek) {
    var trades = [];
    _.each(team1.players, (player1) => {
      _.each(team2.players, (player2) => {
        var team1AfterTrade = team1.afterTrade([player1], [player2]);
        var team2AfterTrade = team2.afterTrade([player2], [player1]);

        var trade = new Trade(
          team1, 
          team2, 
          [player1], 
          [player2], 
          team1AfterTrade.expectedPointsRestOfSeason(currentWeek) - team1.expectedPointsRestOfSeason(currentWeek),
          team2AfterTrade.expectedPointsRestOfSeason(currentWeek) - team2.expectedPointsRestOfSeason(currentWeek));
        trades.push(trade);
      });
    });

    return trades;
  }

  getAll2v2Trades(team1, team2, currentWeek) {
    var trades = [];
    _.each(team1.players, (team1player1) => {
      _.each(_.without(team1.players, team1player1), (team1player2) => {
        _.each(team2.players, (team2player1) => {
          _.each(_.without(team2.players, team2player1), (team2player2) => {
            var team1AfterTrade = team1.afterTrade([team1player1, team1player2], [team2player1, team2player2]);
            var team2AfterTrade = team2.afterTrade([team2player1, team2player2], [team1player1, team1player2]);

            var trade = new Trade(
              team1, 
              team2, 
              [team1player1, team1player2], 
              [team2player1, team2player2], 
              team1AfterTrade.expectedPointsRestOfSeason(currentWeek) - team1.expectedPointsRestOfSeason(currentWeek),
              team2AfterTrade.expectedPointsRestOfSeason(currentWeek) - team2.expectedPointsRestOfSeason(currentWeek));
            trades.push(trade);
          });
        });
      });
    });

    return trades;
  }

  getAll2v1Trades(team1, team2, currentWeek) {
    var trades = [];
    _.each(team1.players, (team1player1) => {
      _.each(_.without(team1.players, team1player1), (team1player2) => {
        _.each(team2.players, (team2player1) => {
            var team1AfterTrade = team1.afterTrade([team1player1, team1player2], [team2player1]);
            var team2AfterTrade = team2.afterTrade([team2player1], [team1player1, team1player2]);

            var trade = new Trade(
              team1, 
              team2, 
              [team1player1, team1player2], 
              [team2player1], 
              team1AfterTrade.expectedPointsRestOfSeason(currentWeek) - team1.expectedPointsRestOfSeason(currentWeek),
              team2AfterTrade.expectedPointsRestOfSeason(currentWeek) - team2.expectedPointsRestOfSeason(currentWeek));
            trades.push(trade);
        });
      });
    });

    return trades;
  }
}

export default League;