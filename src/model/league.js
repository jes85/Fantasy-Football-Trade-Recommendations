class League {
  constructor(seasonId, players, teams, proTeamIdToByeWeekMap, numWeeksInSeason, startingLineupSlots, maxLineupSlots) {
      this.seasonId = seasonId;
      this.players = players;
      this.teams = teams;
      this.proTeamIdToByeWeekMap = proTeamIdToByeWeekMap;
      this.numWeeksInSeason = numWeeksInSeason;
      this.startingLineupSlots = startingLineupSlots;
      this.maxLineupSlots = maxLineupSlots;
  }

  // toString() {
  //   //console.log(`Teams:\n\n ${_.map(this.teams, (team) => team.toString())}`);
  // }
}
 
export default League;