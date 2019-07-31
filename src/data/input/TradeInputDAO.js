/**
 * A TradeInput data access object. i.e. a TradeInputStorer and TradeInputRetriever.
 */
class TradeInputDAO {

  constructor(tradeInputRetriever, tradeInputStorer) {
    this.tradeInputRetriever = tradeInputRetriever;
    this.tradeInputStorer = tradeInputStorer;
  }

  loadLeague(seasonId, currentWeek) {
    return this.tradeInputRetriever.loadLeague(seasonId, currentWeek);
  }

  saveLeague(league) {
    this.tradeInputStorer.saveLeague(league);
  }
}

export default TradeInputDAO;