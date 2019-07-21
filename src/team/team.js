import _ from 'lodash';
import Player from '../player/player.js';

class Team {

	// Use this to parse the real teams after the draft
	static buildFromServer(teamData, playersData) {
		var players = []
		_.each(playersData, (playerData) => {
			if (playersData["onTeamId"] == teamData.id) {
				players.push(Player.buildFromServer(playerData.player));
			}
        });
		return new Team(teamData.id, teamData.nickname, players);
	}

	// Use this to create fake teams before the draft
	// TODO this should probably live somewhere else
	static buildFromFakeServer(teamData, players, teamIndex, totalTeams) {
		var playersOnTeam = []
		var i = 0;
		_.each(players, (player) => {
			if (!_.includes(player.eligibleSlots, 16) && !_.includes(player.eligibleSlots, 17)) { // skip D/ST
				if (i % totalTeams == teamIndex) {
				playersOnTeam.push(player);
				//console.log(player);
				}
				i++;
			}
			
        });
		return new Team(teamData.id, teamData.nickname, playersOnTeam);
	}

	constructor(id, nickname, players) {
	    this.id = id;
	    this.nickname = nickname;
	    this.players = players;
	}

	// todo calculate
	expectedPointsRestOfSeason() {
		// use League.startingLineupSlots
		//console.log(Math.abs(this.players[0].id));
		return Math.abs(this.players[0].id) > 3000 ? 1000 : 10;
	}

	afterTrade(playersToRemove, playersToAdd) {
		//var newPlayers = _.without(this.players, ...playersToRemove);
		var newPlayers = _.union(_.without(this.players, ...playersToRemove), playersToAdd);
		return new Team(this.id, this.nickname, newPlayers);
	}

	// toString() {
 //        return '(' + this.id + ', ' + this.nickname + ', ' + this.players.toString() + ')';
 //    }

	// validateRoster() {
	// 	_.each(League.rosterSlots, (rosterSlot) => {
	// 		_.each(this.players, (player) => {
	// 			if (!player.satisfiesRosterSlot(rosterSlot)) {
	// 				return false;
	// 			} 
	// 		});
 //        });
 //        return true;
	// }
}

export default Team;
