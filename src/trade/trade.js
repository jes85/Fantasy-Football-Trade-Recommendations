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
		this.score = this.calculateScore();
	}

	// TODO tune
	// highest score for team1 that doesn't hurt team2
	calculateScore() {
		if (this.team1ExpectedPointsAdded <= 0 || this.team2ExpectedPointsAdded <= 0) {
			//console.log("ONE TEAM LOSES");
			return -1;
		} else {
			console.log("BOTH TEAMS WIN: " + this.team1ExpectedPointsAdded);
			return this.team1ExpectedPointsAdded;
		}
	}
}

export default Trade;
