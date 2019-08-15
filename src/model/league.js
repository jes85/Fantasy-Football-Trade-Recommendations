
/**
 * A League represents a Fantasy Football League.
 * 
 * {String} leagueId A unique identifier for the league from Espn
 * {int} seasonId The id/year of the season (2018, 2019)
 * {Team[]} teams The teams in the league
 * {Map<String, String>}  proTeamIdToByeWeekMap A map of proTeamId to byeWeek
 * {int} numWeeksInSeason The total number of weeks in the season
 * {Map<String, int>} startingLineupSlots A map of positionId to numberOfPlayers in the starting lineup with that positionId
 * {Map<String, int>} maxLineupSlots A map of positionId to maximum numberOfPlayers that the team is allowed to have with that positionId (startingLineup + bench)
 */
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
}
 
export default League;