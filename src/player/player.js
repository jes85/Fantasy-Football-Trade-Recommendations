import _ from 'lodash';
import { numWeeksInSeason } from '../constants/constants.js';

class Player {

	static buildFromServer(playerData, proTeamIdToByeWeekMap, totalExpectedPoints2019) {
		// espn uses ints, i use string. todo decide which to use
		const eligibleSlots = _.map(playerData.player.eligibleSlots, (eligibleSlot) => eligibleSlot.toString());
		return new Player(playerData.id, playerData.player.fullName, eligibleSlots, playerData.onTeamId, proTeamIdToByeWeekMap[playerData.onTeamId].byeWeek, totalExpectedPoints2019);
	}

	constructor(id, fullName, eligibleSlots, proTeamId, byeWeek, totalExpectedPoints2019) {
	    this.id = id;
	    this.fullName = fullName;
	    this.eligibleSlots = eligibleSlots;
	    this.proTeamId = proTeamId;
	    this.byeWeek = byeWeek;
	    this.totalExpectedPoints2019 = totalExpectedPoints2019;
	}

	expectedPointsForWeek(week) {
		return week == this.byeWeek ? 0 : this.totalExpectedPoints2019 / numWeeksInSeason;
	}

	// currentWeek is the week we are trying to project. Games have not occurred yet.
	expectedPointsRestOfSeason(currentWeek) {
		const isByeWeekOver = this.byeWeek < currentWeek;
		const weeksRemaining = isByeWeekOver ? numWeeksInSeason - currentWeek : numWeeksInSeason - currentWeek - 1;
		return this.totalExpectedPoints2019 * weeksRemaining;
	}

	satisfiesStartingLineupSlot(slot) {
		return _.includes(this.eligibleSlots, slot);
	}
}

export default Player;
