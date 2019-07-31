import _ from 'lodash';
import EspnClient from './clients/espnclient.js';
import EspnClientTradeInputRetriever from './data/input/EspnClientTradeInputRetriever.js';
import ConsoleTradeInputStorer from './data/input/ConsoleTradeInputStorer.js';
import TradeInputDAO from './data/input/TradeInputDAO.js';
import TradeEvaluator from './computations/TradeEvaluator.js';
import TradeEnumerator from './computations/TradeEnumerator.js';
import TradeRecommender from './computations/TradeRecommender.js';
import ConsoleTradeOutputStorer from './data/output/ConsoleTradeOutputStorer.js';
import TradeOutputDAO from './data/output/TradeOutputDAO.js';

/**
 * Input params.
 */
// Not committing secrets to git. To run this program, create a file at path ./secrets/secrets.js and export these constants.
import { leagueId, espnS2, swid } from './secrets/secrets.js';
var currentWeek = 0;
var seasonId = 2019;

/**
 * Wire in classes.
 * TODO dependency injection
 */
var espnClient = new EspnClient({ leagueId: leagueId, espnS2: espnS2, SWID: swid });
var tradeInputRetriever = new EspnClientTradeInputRetriever(espnClient);
var tradeInputStorer = new ConsoleTradeInputStorer();
var tradeInputDAO = new TradeInputDAO(tradeInputRetriever, tradeInputStorer);

var tradeEnumerator = new TradeEnumerator();
var tradeEvaluator = new TradeEvaluator();
var tradeRecommender = new TradeRecommender(tradeEnumerator, tradeEvaluator);

var tradeOutputRetriever = null;
var tradeOutputStorer = new ConsoleTradeOutputStorer();
var tradeOutputDAO = new TradeOutputDAO(tradeOutputRetriever, tradeOutputStorer);

/**
 * Main entry point.
 */
tradeInputDAO.loadLeague(seasonId, currentWeek).then((league) => {
  //tradeInputDAO.saveLeague(league);
  var bestTradesMap = tradeRecommender.findBestTrades(league);
  tradeOutputDAO.saveTrades(league, bestTradesMap, currentWeek);
});
