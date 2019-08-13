class League {
  constructor(leagueId, seasonId, teams, proTeamIdToByeWeekMap, numWeeksInSeason, startingLineupSlots, maxLineupSlots) {
      this.leagueId = leagueId;
      this.seasonId = seasonId;
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