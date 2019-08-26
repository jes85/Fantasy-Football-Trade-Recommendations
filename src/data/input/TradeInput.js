
/**
 * Input to the trade algorithm. Coupled to espn.
 */
class TradeInput {
  /**
   *
   * @param {League} league
   * @param {Map<String, float> } playerProjections Map of espn player name to projected points per week
   */
  constructor(league, playerProjections) {
    this.league = league;
    this.playerProjections = playerProjections;
  }
}