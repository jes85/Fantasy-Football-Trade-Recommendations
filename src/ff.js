import _ from 'lodash';
import EspnClient from './clients/espnClient.js';
import EspnClientTradeInputRetriever from './data/input/espnClientTradeInputRetriever.js';
import ConsoleTradeInputStorer from './data/input/consoleTradeInputStorer.js';
import TradeInputDAO from './data/input/tradeInputDAO.js';
import TradeEvaluator from './computations/tradeEvaluator.js';
import TradeEnumerator from './computations/tradeEnumerator.js';
import TradeRecommender from './computations/tradeRecommender.js';
import ConsoleTradeOutputStorer from './data/output/consoleTradeOutputStorer.js';
import FileBasedTradeOutputDAO from './data/output/fileBasedTradeOutputDAO.js';
import TradeOutputDAO from './data/output/tradeOutputDAO.js';

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
tradeOutputDAO = new FileBasedTradeOutputDAO();

function generateTrades(seasonId, currentWeek) {
  tradeInputDAO.loadLeague(seasonId, currentWeek).then((league) => {
    //tradeInputDAO.saveLeague(league);
    var bestTradesMap = tradeRecommender.findBestTrades(league);
    tradeOutputDAO.saveTrades(league, bestTradesMap, currentWeek);
  });
}

function loadTrades(leagueId, seasonId, currentWeek) {
  tradeOutputDAO.loadTrades(leagueId, seasonId, currentWeek);
}

/**
 * Main entry point.
 */
//generateTrades(seasonId, currentWeek);
loadTrades(leagueId, seasonId, currentWeek);