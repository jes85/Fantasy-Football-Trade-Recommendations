
/**
 * Output of the trade algorithm.
 */
class TradeOutput {
  /**
   * @param {String} leagueId A unique identifier for the ESPN league
   * @param {String} seasonId The seasonId
   * @param {int} weekId The weekId
   * @param {Object} bestTradesMap The object containing the best trades information for the given leagueId/seasonId/weekId
   */
  constructor(leagueId, seasonId, weekId, bestTradesMap) {
    this.leagueId = leagueId;
    this.seasonId = seasonId;
    this.weekId = weekId;
    this.bestTradesMap = bestTradesMap;
  }
}

export default TradeOutput;