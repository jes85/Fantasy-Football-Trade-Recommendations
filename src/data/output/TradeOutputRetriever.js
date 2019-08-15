/**
 * A TradeOutputRetriever retrieves trade output data from an arbitrary destination.
 */
class TradeOutputRetriever {
  /**
   * Load best trades for the given league in the given season and week
   * @param {String} leagueId A unique identifier for the ESPN league to load trades for
   * @param {String} seasonId The season to load trades for
   * @param {int} weekId The week to load trades for
   * @return {TradeOutput} The TradeOutput data
   */
  loadTrades(leagueId, seasonId, weekId) {
  }
}

export default TradeOutputRetriever;