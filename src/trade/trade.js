import _ from 'lodash';

class Trade {
  constructor(
    team1,
    team2,
    playersToTradeOnTeam1,
    playersToTradeOnTeam2,
    team1ExpectedPointsAdded,
    team2ExpectedPointsAdded) {
    this.team1 = team1;
    this.team2 = team2;
    this.playersToTradeOnTeam1 = playersToTradeOnTeam1;
    this.playersToTradeOnTeam2 = playersToTradeOnTeam2;
    this.team1ExpectedPointsAdded = team1ExpectedPointsAdded;
    this.team2ExpectedPointsAdded = team2ExpectedPointsAdded;
    this.team1TradeScore = this.calculateTeam1Score(team1ExpectedPointsAdded, team2ExpectedPointsAdded);
    this.team2TradeScore = this.calculateTeam1Score(team2ExpectedPointsAdded, team1ExpectedPointsAdded);
    this.overallTradeScore = this.calculateOverallScore(team1ExpectedPointsAdded, team2ExpectedPointsAdded);

  }

  includesTeam(team) {
    return team.id == this.team1.id || team.id == this.team2.id;
  }

  tradeScoreForTeam(team) {
    if (!this.includesTeam(team)) {
      throw `Can't get tradeScore for team ${team.id} because that team is not involved in this trade.`
    } else if (team.id == this.team1.id) {
      return this.team1TradeScore;
    } else if (team.id == this.team2.id) {
      return this.team2TradeScore;
    }
  }

  // Weighted in favor of team1.
  // TODO tune
  calculateTeam1Score(team1ExpectedPointsAdded, team2ExpectedPointsAdded) {

    // Make sure both teams benefit.
    if (team1ExpectedPointsAdded <= 0 || team2ExpectedPointsAdded <= 0) {
      return -1;
    } else {
      // Bias towards team1, but make sure discrepancy is not too high. Add 100 so that we don't go below 0 (todo adjust)
      return 100 + 0.8*team1ExpectedPointsAdded + 0.2*team2ExpectedPointsAdded - 0.8 * Math.abs(team1ExpectedPointsAdded - team2ExpectedPointsAdded);
    }
  }

  // Weighted in favor of overall trade fairness + impact.
  // TODO tune
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
      `team1: ${this.team1.id} team2: ${this.team2.id} \n` +
      `playersToTradeOnTeam1: ${_.map(this.playersToTradeOnTeam1, (player) => player.fullName)} \n` +
      `playersToTradeOnTeam2: ${_.map(this.playersToTradeOnTeam2, (player) => player.fullName)} \n` +
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
