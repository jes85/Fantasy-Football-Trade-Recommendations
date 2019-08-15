import _ from 'lodash';

/**
 * A Trade involves two teams that swap players, with associated scores for how good the trade is.
 * 
 * TODO extract the logic that calculates the scores to a different class.
 * Note: I changed Team/Player to nickname/fullName because the output files were too long for the frontend to load.
 *   TODO: Change it back to Team/Player, and change the OutputStorers to strip the values of interest when printing.
 *   ~~Team team1 The first team involved in the trade~~
 *   ~~Team team2 The second team involved in the trade~~
 *   ~~Player[] team1PlayersToTrade Players on team1 that will be traded to team2~~
 *   ~~Player[] team2PlayersToTrade Players on team2 that will be traded to team1~~
 * 
 * {String} team1 The nickname of the first team involved in the trade
 * {String} team2 The nickname of the second team involved in the trade
 * {String[]} team1PlayersToTrade An list of the fullNames of the Players on team1 that will be traded to team2
 * {String[]} team2PlayersToTrade An list of the fullNames of the Players on team2 that will be traded to team1
 * {float} team1ExpectedPointsAdded The difference in the number of points team1 is projected to score the rest of the season if they do the trade vs if they don't.
     i.e. team1AfterTrade.calculateExpectedPointsRestOfSeason() - team1.calculateExpectedPointsRestOfSeason()
 * {float} team2ExpectedPointsAdded The difference in the number of points team2 is projected to score the rest of the season if they do the trade vs if they don't.
     i.e. team2AfterTrade.calculateExpectedPointsRestOfSeason() - team2.calculateExpectedPointsRestOfSeason()
 * {float} team1TradeScore A score assigned to the trade, biased towards value added to team1 while still being a fair trade for team2.
 * {float} team2TradeScore A score assigned to the trade, biased towards value added to team2 while still being a fair trade for team1.
 * {float} overallTradeScore A score assigned to the trade, unbiased to either team. Focused on maximizing total value added to each team while still being a fair trade for each team.
 */
class Trade {
  constructor(
    team1,
    team2,
    team1PlayersToTrade,
    team2PlayersToTrade,
    team1ExpectedPointsAdded,
    team2ExpectedPointsAdded) {
    this.team1 = team1;
    this.team2 = team2;
    this.team1PlayersToTrade = team1PlayersToTrade;
    this.team2PlayersToTrade = team2PlayersToTrade;
    this.team1ExpectedPointsAdded = team1ExpectedPointsAdded;
    this.team2ExpectedPointsAdded = team2ExpectedPointsAdded;
    this.team1TradeScore = this.calculateTeam1Score(team1ExpectedPointsAdded, team2ExpectedPointsAdded);
    this.team2TradeScore = this.calculateTeam1Score(team2ExpectedPointsAdded, team1ExpectedPointsAdded);
    this.overallTradeScore = this.calculateOverallScore(team1ExpectedPointsAdded, team2ExpectedPointsAdded);
  }

  /**
   * Returns the Trade score for the given team.
   *
   * @param {Team} team
   * @return {int} The trade score for team1 or team2
   * @throws exception if the Trade does not involve the given Team.
   */
  tradeScoreForTeam(team) {
    if (!this.involvesTeam(team)) {
      throw `Can't get tradeScore for team ${team.nickname} because that team is not involved in this trade.`
    } else if (team.nickname == this.team1) {
      return this.team1TradeScore;
    } else if (team.nickname == this.team2) {
      return this.team2TradeScore;
    }
  }

  /**
   * Convenience method for determining if a given Team is involved in this Trade.
   * 
   * @param {Team} team
   * @return {boolean} True if this trade includes the given Team.
   */
  involvesTeam(team) {
    return team.nickname == this.team1 || team.nickname == this.team2;
  }

  /**
   * Calculate the trade score for team1. 
   * 
   * Goal:
   *   This score will be used to determine the best trades for team1. 
   * Intuition:
   *   The best trades for team1 are the ones with the highest team1ExpectedPointsAdded THAT TEAM2 WILL ACCEPT.
   *   We can't just rank by team1ExpectedPointsAdded, because if team2ExpectedPointsAdded are too low, then team2 will never accept the trade.
   *   The criteria for team2 accepting the trade can vary. Currently we use a combination of total expected points added + fairness as an estimation for trade quality.
   * Algorithm:
   *   See inline comments.
   *   TODO tune
   * @param {float} team1ExpectedPointsAdded The difference in the number of points team1 is projected to score the rest of the season if they do the trade vs if they don't.
   * @param {float} team2ExpectedPointsAdded The difference in the number of points team2 is projected to score the rest of the season if they do the trade vs if they don't.
   * @return {float} The trade score for team1
   */
  calculateTeam1Score(team1ExpectedPointsAdded, team2ExpectedPointsAdded) {

    // Make sure both teams benefit.
    if (team1ExpectedPointsAdded <= 0 || team2ExpectedPointsAdded <= 0) {
      return -1;
    } else {
      // Bias towards team1, but make sure discrepancy is not too high. Add 100 so that we don't go below 0 (todo adjust)
      return 100 + 0.8*team1ExpectedPointsAdded + 0.2*team2ExpectedPointsAdded - 0.8 * Math.abs(team1ExpectedPointsAdded - team2ExpectedPointsAdded);
    }
  }

  /**
   * Calculate the overall trade score. This is not weighted in favor of team1 or team2.
   * 
   * Goal:
   *   This score will be used to determine the best overall trades for the league.
   * Intuition:
   *   The best overall trades are the ones THAT BOTH TEAMS WILL ACCEPT and have the highest value added for both teams.
   *   The criteria for team2 accepting the trade can vary. Currently we use a combination of total expected points added + fairness as estimation for trade quality,
   * Algorithm:
   *   See inline comments.
   *   TODO tune
   * @param {float} team1ExpectedPointsAdded The difference in the number of points team1 is projected to score the rest of the season if they do the trade vs if they don't.
   * @param {float} team2ExpectedPointsAdded The difference in the number of points team2 is projected to score the rest of the season if they do the trade vs if they don't.
   * @return {float} The overallTradeScore
   */
  calculateOverallScore(team1ExpectedPointsAdded, team2ExpectedPointsAdded) {
    // Make sure both teams benefit.
    if (team1ExpectedPointsAdded <= 0 || team2ExpectedPointsAdded <= 0) {
      return -1;
    } else {
      return 100 + 0.5*team1ExpectedPointsAdded + 0.5*team2ExpectedPointsAdded - 0.8 * Math.abs(team1ExpectedPointsAdded - team2ExpectedPointsAdded);
    }
  }

  toString() {
    var tradeString = "\n" +
      `team1: ${this.team1} team2: ${this.team2} \n` +
      `team1PlayersToTrade: ${this.team1PlayersToTrade} \n` +
      `team2PlayersToTrade: ${this.team2PlayersToTrade} \n` +
      `team1ExpectedPointsAdded: ${this.team1ExpectedPointsAdded} \n` +
      `team2ExpectedPointsAdded: ${this.team2ExpectedPointsAdded} \n` +
      `team1TradeScore: ${this.team1TradeScore} \n` +
      `team2TradeScore: ${this.team2TradeScore} \n` +
      `overallTradeScore: ${this.overallTradeScore}\n`;
    if (this.team1ExpectedPointsAdded <= 0 || this.team2ExpectedPointsAdded <= 0) {
      return `ONE TEAM LOSES. ${tradeString}`;
    } else {
      return `BOTH TEAMS WIN! ${tradeString}`;
    }
  }
}

export default Trade;
