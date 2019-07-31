/**
 * A TradeOutput data access object. i.e. a TradeOutputStorer and TradeOutputRetriever.
 */
class TradeOutputDAO {

  constructor(tradeOutputRetriever, tradeOutputStorer) {
    this.tradeOutputRetriever = tradeOutputRetriever;
    this.tradeOutputStorer = tradeOutputStorer;
  }

  loadTrades(leagueId, seasonId, weekId) {
    return this.tradeOutputRetriever.loadTrades(leagueId, seasonId, weekId);
  }

  saveTrades(league, bestTradesMap, currentWeek) {
    this.tradeOutputStorer.saveTrades(league, bestTradesMap, currentWeek);
  }
}

export default TradeOutputDAO;