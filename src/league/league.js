import _ from 'lodash';
import Trade from '../trade/trade.js';

class League {
    constructor(numWeeksInSeason, startingLineupSlots) {
	    this.numWeeksInSeason = numWeeksInSeason;
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
				var best1v1Trades = this.calculateBest1v1Trades(team, otherTeam, currentWeek); // calculateBestnvmTrades(Team1, Team2, 1, 1)

				// # 2v2 trades
				var best2v2Trades = [];//this.calculateBest2v2Trades(team, otherTeam, currentWeek); // calculateBestnvmTrades(Team1, Team2, 2, 2)

				var best1v2Trades = this.calculateBest2v1Trades(otherTeam, team, currentWeek);
				// # 3v3 trades
				// best3v3Trades = calculateBestnvmTrades(Team1, Team2, 3, 3)

			    //bestTrades = [best1v1Trades+best2v2Trades+best3v3Trades].sortBy(team1Score)
			    var bestTradesForTeam1WithTeam2 = best1v1Trades.concat(best2v2Trades).concat(best1v2Trades);
			    trades = trades.concat(bestTradesForTeam1WithTeam2);
			}
		});
		//console.log(trades.length);
		var bestTrades = _.sortBy(_.filter(trades, (trade) => trade.score > 0), (trade) => -trade.score);
		var bestTrade = bestTrades[0];
		console.log("best trades for team " + team.id + ": " + _.map(bestTrades, (trade) => trade.toString()));
		//console.log("best trade for team " + team.id + ": " + bestTrade.team1.id + ", " + bestTrade.team2.id + ", " + _.map(bestTrade.playersToTradeOnTeam1, (player) => player.fullName) + ", " + _.map(bestTrade.playersToTradeOnTeam2, (player) => player.fullName) + "," + bestTrade.team1ExpectedPointsAdded + ", " + bestTrade.team2ExpectedPointsAdded + ", " + bestTrade.score);
	}

	calculateBest1v1Trades(team1, team2, currentWeek) {
		var trades = []; // use priorityqueue instead?
		_.each(team1.players, (player1) => {
			_.each(team2.players, (player2) => {
				if (_.includes(player1.eligibleSlots, '0')) {
					return;
				}
				var team1AfterTrade = team1.afterTrade([player1], [player2]);
				if (team1AfterTrade.players[0].id != team1.players[0].id) {
					//console.log(team1AfterTrade.expectedPointsRestOfSeason(currentWeek) == team1.expectedPointsRestOfSeason(currentWeek));
				}
				//console.log(team1AfterTrade.players.length == team1.players.length);
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

		return _.sortBy(trades, (trade) => -trade.score);
	}

	calculateBest2v2Trades(team1, team2, currentWeek) {
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

		return _.sortBy(trades, (trade) => -trade.score);
	}

	calculateBest2v1Trades(team1, team2, currentWeek) {
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

		return _.sortBy(trades, (trade) => -trade.score);
	}
}

export default League;