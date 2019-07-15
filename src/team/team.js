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
	static buildFromFakeServer(teamData, playersData, teamIndex, totalTeams) {
		var players = []
		var i = 0;
		_.each(playersData, (playerData) => {
			if (i % totalTeams == teamIndex) {
				players.push(Player.buildFromServer(playerData.player));
			}
			i++;
        });
		return new Team(teamData.id, teamData.nickname, players);
	}

	constructor(id, nickname, players) {
	    this.id = id;
	    this.nickname = nickname;
	    this.players = players;
	}
}

export default Team;
