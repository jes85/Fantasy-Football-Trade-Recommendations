import _ from 'lodash';
import Trade from '../model/Trade.js';

/**
 * Enumerates possible trades in a given league.
 */
class TradeEnumerator {

  /////////////////////////////////////////////// Public Methods /////////////////////////////////////////////////////

  /**
   * Get all possible trades in the given league. Note currently we only consider trades between 2 teams that involve 1-3 players per team.
   * 
   * @param {League} league 
   * @return {Trade[]} A list of all possible trades that teams in the league can execute.
   */
  getAllTrades(league) {
    var trades = [];
    _.each(league.teams, (team, i) => {
      // Don't need to calculate trades twice.
      var otherTeams = league.teams.slice(i + 1, league.teams.length);
      trades = trades.concat(this._getAllTradesForTeam(team, otherTeams, league.currentWeek, league.numWeeksInSeason, league.startingLineupSlots));
    });
    return trades;
  }

  /////////////////////////////////////////////// Private Methods /////////////////////////////////////////////////////

  /**
   * Get all possible trades for the given team. Note currently we only consider trades between 2 teams that involve 1-3 players per team.
   * 
   * @param {Team} team
   * @param {Team[]} otherTeams
   * @param {int} currentWeek
   * @param {int} numWeeksInSeason
   * @param {Map<String, int>} startingLineupSlots
   * @return {Trade[]} A list of all possible trades that the given team can execute with any team in otherTeams.
   * @private
   */
  _getAllTradesForTeam(team, otherTeams, currentWeek, numWeeksInSeason, startingLineupSlots) {
    var trades = [];
    _.each(otherTeams, (otherTeam) => {

      //var all1v1Trades = [];
      //var all1v1Trades = this.getAll1v1Trades(team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);
      var all1v1Trades = this._getAllnVmTrades(1, 1, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);


      var all2v2Trades = [];
      //var all2v2Trades = this.getAll2v2Trades(team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots); 
      //var all2v2Trades = this._getAllnVmTrades(2, 2, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);

      var all2v1Trades = [];
      //var all2v1Trades = this.getAll2v1Trades(team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);
      //var all2v1Trades = this._getAllnVmTrades(2, 1, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);
    
      var all1v2Trades = [];
      //var all1v2Trades = this.getAll2v1Trades(otherTeam, team, currentWeek, numWeeksInSeason, startingLineupSlots);
      //var all1v2Trades = this._getAllnVmTrades(1, 2, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);

      var all3v3Trades = [];
      //var all3v3Trades = this._getAllnVmTrades(3, 3, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);
      
      var all3v2Trades = [];
      //var all3v2Trades = this._getAllnVmTrades(3, 2, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);

      var all2v3Trades = [];
      //var all2v3Trades = this._getAllnVmTrades(2, 3, team, otherTeam, currentWeek, numWeeksInSeason, startingLineupSlots);

      // todo can I do this more efficiently?
      trades = trades.concat(all1v1Trades).concat(all2v2Trades).concat(all2v1Trades).concat(all1v2Trades).concat(all3v3Trades).concat(all3v2Trades).concat(all2v3Trades);
    });
    return trades;
  }

  /**
   * Get all possible trades between team1 and team2 that involve n players from team 1 and n players from team2
   * 
   * @param {int} n
   * @param {int} m
   * @param {Team} team1
   * @param {Team} team2
   * @param {int} currentWeek
   * @param {int} numWeeksInSeason
   * @param {Map<String, int>} startingLineupSlots 
   * @return {Trade[]} A list of all possible trades between team1 and team2 that involve n players from team 1 and n players from team2
   * @private
   */
  _getAllnVmTrades(n, m, team1, team2, currentWeek, numWeeksInSeason, startingLineupSlots) {
    var trades = [];
    var playersToTradeFromTeam1Combinations = this._getPlayerCombinations(n, team1.players);
    var playersToTradeFromTeam2Combinations = this._getPlayerCombinations(m, team2.players);
    _.each(playersToTradeFromTeam1Combinations, (playersToTradeFromTeam1) => {
      _.each(playersToTradeFromTeam2Combinations, (playersToTradeFromTeam2) => {

        var team1AfterTrade = team1.afterTrade(playersToTradeFromTeam1, playersToTradeFromTeam2);
        var team2AfterTrade = team2.afterTrade(playersToTradeFromTeam2, playersToTradeFromTeam1);

        // Storing less info because file is too long. TODO set up a data structure to be able to retrieve the full data
        // i.e. store team1 id, player id, and look them up in a team/players list.
        var trade = new Trade(
          team1.nickname, 
          team2.nickname, 
          _.map(playersToTradeFromTeam1, player => player.fullName), 
          _.map(playersToTradeFromTeam2, player => player.fullName), 
          team1AfterTrade.calculateExpectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team1.calculateExpectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots),
          team2AfterTrade.calculateExpectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots) - team2.calculateExpectedPointsRestOfSeason(currentWeek, numWeeksInSeason, startingLineupSlots));
        
          trades.push(trade);
      });
    });
    return trades;
  }

  /**
   * Get a list of all combinations of n players from a list of players. n must be < players.length
   * TODO clean this up/test this. It's confusing.
   * 
   * @param {int} n
   * @param {Players[]} players
   * @return {Player[n][]}
   * @private
   */
  _getPlayerCombinations(n, players) {
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
        playerCombinationsWithPlayerI = this._getPlayerCombinations(n - 1, players.slice(i + 1, totalPlayers));
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