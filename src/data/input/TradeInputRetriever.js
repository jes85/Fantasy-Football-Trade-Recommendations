/**
 * A TradeOutputRetriever retrieves trade input data from an arbitrary destination.
 * 
 * "TradeInput" is the input data required to run the trade algorithm.
 * TODO consider creating a TradeInput object
 */
class TradeInputRetriever{
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
}

export default TradeInputRetriever;