class Player {

	static buildFromServer(playerData, proTeamIdToByeWeekMap, totalExpectedPoints2019) {
		return new Player(playerData.id, playerData.player.fullName, playerData.player.eligibleSlots, playerData.onTeamId, proTeamIdToByeWeekMap[playerData.onTeamId].byeWeek, totalExpectedPoints2019);
	}

	constructor(id, fullName, eligibleSlots, proTeamId, byeWeek, totalExpectedPoints2019) {
	    this.id = id;
	    this.fullName = fullName;
	    this.eligibleSlots = eligibleSlots;
	    this.proTeamId = proTeamId;
	    this.totalExpectedPoints2019 = totalExpectedPoints2019;
	}

	// toString() {
 //        return '(' + this.id + ', ' + this.fullName + ', ' + this.eligibleSlots + ', ' + this.proTeamId + ')';
 //    }

	expectedPointsInWeek(week) {
		const totalWeeksInSeason = 16;
		return week == this.byeWeek ? 0 : totalExpectedPoints2019 / totalWeeksInSeason;
	}
}

export default Player;
