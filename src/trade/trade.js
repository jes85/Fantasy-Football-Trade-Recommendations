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
		this.score = this.calculateScore(team1ExpectedPointsAdded, team2ExpectedPointsAdded);
	}

	// TODO tune
	// highest score for team1 that doesn't hurt team2
	calculateScore(team1ExpectedPointsAdded, team2ExpectedPointsAdded) {
		if (team1ExpectedPointsAdded <= 0 || team2ExpectedPointsAdded <= 0) {
			return -1;
		} else {
			return 100 + 0.51*team1ExpectedPointsAdded + 0.49*team2ExpectedPointsAdded - 0.8 * Math.abs(team1ExpectedPointsAdded - team2ExpectedPointsAdded);
		}
	}

	toString() {
		if (this.team1ExpectedPointsAdded <= 0 || this.team2ExpectedPointsAdded <= 0) {
			return "ONE TEAM LOSES. team1: " + this.team1.id + " team2: " + this.team2.id + " playersToTradeOnTeam1: " + _.map(this.playersToTradeOnTeam1, (player) => player.fullName) + " playersToTradeOnTeam2: " + _.map(this.playersToTradeOnTeam2, (player) => player.fullName) + " team1ExpectedPointsAdded: " + this.team1ExpectedPointsAdded + ", team2ExpectedPointsAdded: " + this.team2ExpectedPointsAdded + ", tradeScore: " + this.score + "\n";
		} else {
			return "BOTH TEAMS WIN! team1: " + this.team1.id + " team2: " + this.team2.id + " playersToTradeOnTeam1: " + _.map(this.playersToTradeOnTeam1, (player) => player.fullName) + " playersToTradeOnTeam2: " + _.map(this.playersToTradeOnTeam2, (player) => player.fullName) + " team1ExpectedPointsAdded: " + this.team1ExpectedPointsAdded + ", team2ExpectedPointsAdded: " + this.team2ExpectedPointsAdded + ", tradeScore: " + this.score + "\n";
		}
	}
}

export default Trade;
