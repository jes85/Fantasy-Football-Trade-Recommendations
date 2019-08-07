import _ from 'lodash';
import Trade from '../model/trade.js';

/**
 * Enumerates all trades in a given league
 */
class TradeEnumerator {

  /**
   * Public methods
   */


  getAllTrades(league) {
    var trades = [];
    _.each(league.teams, (team, i) => {
      // Don't need to calculate trades twice.
      var otherTeams = league.teams.slice(i + 1, league.teams.length);
      trades = trades.concat(this.getAllTradesForTeam(team, otherTeams, league.currentWeek, league.numWeeksInSeason, league.startingLineupSlots));
    });
    return trades;
  }

   /**
   * Private methods
   */


  getAllTradesForTeam(team, otherTeams, currentWeek, numWeeksInSeason, startingLineupSlots) {
    var trades = [];
    _.each(otherTeams, (otherTeam) => {

      //var all1v1Trades = [];
      var all1v1Trades = this.getAll1v1Trades(team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);
      //var all1v1Trades = this.getAllnVmTrades(1, 1, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);


      var all2v2Trades = [];
      //var all2v2Trades = this.getAll2v2Trades(team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots); 
      //var all2v2Trades = this.getAllnVmTrades(2, 2, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);

      var all2v1Trades = [];
      //var all2v1Trades = this.getAll2v1Trades(team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);
      //var all2v1Trades = this.getAllnVmTrades(2, 1, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);
    
      var all1v2Trades = [];
      //var all1v2Trades = this.getAll2v1Trades(otherTeam, team, currentWeek, numWeeksInSeason, startingLineupSlots);
      //var all1v2Trades = this.getAllnVmTrades(1, 2, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);

      var all3v3Trades = [];
      //var all3v3Trades = this.getAllnVmTrades(3, 3, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);
      
      var all3v2Trades = [];
      //var all3v2Trades = this.getAllnVmTrades(3, 2, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);

      var all2v3Trades = [];
      //var all2v3Trades = this.getAllnVmTrades(2, 3, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);

      // todo can I do this more efficiently?
      trades = trades.concat(all1v1Trades).concat(all2v2Trades).concat(all2v1Trades).concat(all1v2Trades).concat(all3v3Trades).concat(all3v2Trades).concat(all2v3Trades);
    });
    return trades;
  }

  getAll1v1Trades(team1, team2, currentWeek, numWeeksInSeason, startingLineupSlots) {
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
          team1AfterTrade.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team1.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots),
          team2AfterTrade.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team2.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots));
        trades.push(trade);
      });
    });

    return trades;
  }

  getAll2v2Trades(team1, team2, currentWeek, numWeeksInSeason, startingLineupSlots) {
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
              team1AfterTrade.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team1.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots),
              team2AfterTrade.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team2.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots));
            trades.push(trade);
          });
        });
      });
    });

    return trades;
  }

  getAll2v1Trades(team1, team2, currentWeek, numWeeksInSeason, startingLineupSlots) {
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
              team1AfterTrade.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team1.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots),
              team2AfterTrade.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team2.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots));
            trades.push(trade);
        });
      });
    });

    return trades;
  }

// getAll3v2Trades(team1, team2, currentWeek, numWeeksInSeason, startingLineupSlots) {
//   var trades = [];
//   _.each(team1.players, (team1player1) => {
//     var team1WithoutFirst1Player = _.without(team1.players, team1player1);
//     _.each(team1WithoutFirst1Players, (team1player2) => {
//       var team1WithoutFirst2Players = _.without(team1WithoutFirst1Players, team1player2);
//       _.each(team1WithoutFirst2Players, (team1player3) => {
//         _.each(team2.players, (team2player1) => {
//           var team2WithoutFirst1Player = _.without(team2.players, team2player1);
//           _.each(team2WithoutFirst1Player, (team2player2) => {
//             var playersToTradeOnTeam1 = [team1player1, team1player2, team1player3];
//             var playersToTradeOnTeam2 = [team2player1, team2player2];
//             var team1AfterTrade = team1.afterTrade(playersToTradeOnTeam1, playersToTradeOnTeam2);
//             var team2AfterTrade = team2.afterTrade(playersToTradeOnTeam2, playersToTradeOnTeam1);

//             var trade = new Trade(
//               team1, 
//               team2, 
//               playersToTradeOnTeam1, 
//               playersToTradeOnTeam2, 
//               team1AfterTrade.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team1.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots),
//               team2AfterTrade.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team2.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots));
//             trades.push(trade);
//         });
//       )};
//     });
//   });

  getAllnVmTrades(n, m, team1, team2, currentWeek, numWeeksInSeason, startingLineupSlots) {
    var trades = [];
    var playersToTradeFromTeam1Combinations = this.getPlayerCombinations(n, team1.players);
    var playersToTradeFromTeam2Combinations = this.getPlayerCombinations(m, team2.players);
    _.each(playersToTradeFromTeam1Combinations, (playersToTradeFromTeam1) => {
      _.each(playersToTradeFromTeam2Combinations, (playersToTradeFromTeam2) => {
        var team1AfterTrade = team1.afterTrade(playersToTradeFromTeam1, playersToTradeFromTeam2);
        var team2AfterTrade = team2.afterTrade(playersToTradeFromTeam2, playersToTradeFromTeam1);

        var trade = new Trade(
          team1, 
          team2, 
          playersToTradeFromTeam1, 
          playersToTradeFromTeam2, 
          team1AfterTrade.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team1.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots),
          team2AfterTrade.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team2.expectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots));
        
          trades.push(trade);
      });
    });
    return trades;
  }

  // TODO clean this up/test this. It's confusing.
  getPlayerCombinations(n, players) {
    var totalPlayers = players.length;
    // Base case 1
    if (n == 0) {
      return [];
    }
    if (totalPlayers < n) {
      return [];
      //throw "Cannot choose " + n + " players from " + totalPlayers + " players.";
    }
    // Base case 2
    if (totalPlayers == n) {
      return [players];
    }

    // Recursively get all player combinations of size n starting with first player
    var playerCombinations = [];
    _.each(players, (player, i) => {
      var playerCombinationsWithPlayerI = [];
      if (n == 1) {
        // Base case 3
        playerCombinationsWithPlayerI.push([player]);
      } else {
        playerCombinationsWithPlayerI = this.getPlayerCombinations(n - 1, players.slice(i + 1, totalPlayers));
        _.each(playerCombinationsWithPlayerI, playerCombination => {
          if (playerCombination.length != n - 1) {
            throw "error";
          }
          playerCombination.push(player);
        });
      }
      playerCombinations = playerCombinations.concat(playerCombinationsWithPlayerI);

    });
    return playerCombinations;
  }
}

export default TradeEnumerator;