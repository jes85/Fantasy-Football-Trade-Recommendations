import _ from 'lodash';
import Trade from '../trade/trade.js';

class League {
    constructor(numWeeks, startingLineupSlots) {
	    this.numWeeks = numWeeks;
	    this.startingLineupSlots = startingLineupSlots;
	}

	calculateBestTrades(currentWeek, teams) {
		_.each(teams, (team) => {
			this.calculateBestTradesForTeam(team, currentWeek, teams);
		});
	}

	calculateBestTradesForTeam(team, currentWeek, teams) {
		var trades = [];
		_.each(teams, (otherTeam) => {
			if (otherTeam.id != team.id) {
				var best1v1Trades = this.calculateBest1v1Trades(team, otherTeam); // calculateBestnvmTrades(Team1, Team2, 1, 1)

				// # 2v2 trades
				// best2v2Trades = calculateBestnvmTrades(Team1, Team2, 2, 2)

				// # 3v3 trades
				// best3v3Trades = calculateBestnvmTrades(Team1, Team2, 3, 3)

			    //bestTrades = [best1v1Trades+best2v2Trades+best3v3Trades].sortBy(team1Score)
			    var bestTradesForTeam1WithTeam2 = best1v1Trades;
			    trades = trades.concat(bestTradesForTeam1WithTeam2);
			}
		});
		var bestTrades = _.sortBy(trades, (trade) => -trade.score);
		var bestTrade = bestTrades[0];
		//console.log("best trade for team " + team.id + ": " + bestTrades[0]);
		console.log("best trade for team " + team.id + ": " + bestTrade.team1.id + ", " + bestTrade.team2.id + ", " + bestTrade.playersToTradeOnTeam1[0].fullName + ", " + bestTrade.playersToTradeOnTeam2[0].fullName + "," + bestTrade.team1ExpectedPointsAdded + ", " + bestTrade.team2ExpectedPointsAdded + ", " + bestTrade.score);
	}

	calculateBest1v1Trades(team1, team2) {
		var trades = []; // use priorityqueue instead?
		_.each(team1.players, (player1) => {
			_.each(team2.players, (player2) => {
				var team1AfterTrade = team1.afterTrade([player1], [player2]);
				if (team1AfterTrade.players[0].id != team1.players[0].id) {
					//console.log(team1AfterTrade.expectedPointsRestOfSeason() == team1.expectedPointsRestOfSeason());
				}
				//console.log(team1AfterTrade.players.length == team1.players.length);
				var team2AfterTrade = team2.afterTrade([player2], [player1]);

				var trade = new Trade(
					team1, 
					team2, 
					[player1], 
					[player2], 
					team1AfterTrade.expectedPointsRestOfSeason() - team1.expectedPointsRestOfSeason(),
					team2AfterTrade.expectedPointsRestOfSeason() - team2.expectedPointsRestOfSeason());
				trades.push(trade);
			});
		});

		return _.sortBy(trades, (trade) => -trade.score);
	}
}

export default League;