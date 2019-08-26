/**
 * A TradeOutputRetriever retrieves trade input data from an arbitrary destination.
 *
 * "TradeInput" is the input data required to run the trade algorithm.
 */
class TradeInputRetriever{

  /**
   * Load TradeInput data for the given league/season/week.
   *
   * @param {String} leagueId
   * @param {String} seasonId
   * @param {int} currentWeek
   * @return {Promise<TradeInput>} The TradeInput wrapped in a Promise (to enable async implementations)
   */
  loadTradeInput(leagueId, seasonId, currentWeek) {
  }

  /**
   * Load league data for the given season and week.
   *
   * @param {String} leagueId
   * @param {String} seasonId
   * @param {int} currentWeek
   * @return {Promise<League>} The league wrapped in a Promise (to enable async implementations)
   */
  loadLeague(leagueId, seasonId, currentWeek) {
  }

  /**
   * Load player projections for the given week.
   *
   * @param {String} seasonId
   * @param {int} currentWeek
   * @return {Promise<Map<String, float>} A map of playerName to projected points per week, wrapped in a Promise (to enable async implementations)
   */
  loadPlayerProjections(seasonId, currentWeek) {

  }
}

export default TradeInputRetriever;