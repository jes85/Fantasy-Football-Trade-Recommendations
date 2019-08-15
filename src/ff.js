import _ from 'lodash';
import EspnClient from './clients/EspnClient.js';
import EspnClientTradeInputRetriever from './data/input/EspnClientTradeInputRetriever.js';
import ConsoleTradeInputStorer from './data/input/ConsoleTradeInputStorer.js';
import FileBasedTradeInputRetriever from './data/input/FileBasedTradeInputRetriever.js';
import FileBasedTradeInputStorer from './data/input/FileBasedTradeInputStorer.js';

import TradeEvaluator from './computations/tradeEvaluator.js';
import TradeEnumerator from './computations/tradeEnumerator.js';
import TradeRecommender from './computations/tradeRecommender.js';
import ConsoleTradeOutputStorer from './data/output/consoleTradeOutputStorer.js';
import FileBasedTradeOutputStorer from './data/output/FileBasedTradeOutputStorer.js';
import FileBasedTradeOutputRetriever from './data/output/FileBasedTradeOutputRetriever.js';

/**
 * Input params.
 */
// Not committing secrets to git. To run this program, create a file at path ./secrets/secrets.js and export these constants.
import { 
  leagueId, 
  espnS2, 
  SWID } from './secrets/secrets.js';

import {
  currentWeek,
  seasonId,
  tradeInputJsonFilePath,
  tradeInputJsFilePath,
  tradeOutputJsonFilePath,
  tradeOutputJsFilePath } from './configuration.js';


/**
 * Wire in classes.
 * TODO dependency injection
 */

function loadLeague(leagueId, seasonId, currentWeek) {
  var espnClient = new EspnClient(espnS2, SWID);
  var tradeInputRetriever = new EspnClientTradeInputRetriever(espnClient);
  var tradeInputStorer = new FileBasedTradeInputStorer(tradeInputJsonFilePath, tradeInputJsFilePath);

  tradeInputRetriever.loadLeague(leagueId, seasonId, currentWeek).then((league) => {
    tradeInputStorer.saveLeague(league);
  });
}

function generateTrades(leagueId, seasonId, currentWeek) {
  // var espnClient = new EspnClient(espnS2, SWID);
  // var tradeInputRetriever = new EspnClientTradeInputRetriever(espnClient);
  var tradeInputRetriever = new FileBasedTradeInputRetriever(tradeInputJsonFilePath);
  var tradeEnumerator = new TradeEnumerator();
  var tradeEvaluator = new TradeEvaluator();
  var tradeRecommender = new TradeRecommender(tradeEnumerator, tradeEvaluator);
  var tradeOutputStorer = new ConsoleTradeOutputStorer();
  //var tradeOutputStorer = new FileBasedTradeOutputStorer(tradeOutputJsonFilePath, tradeOutputJsFilePath);

  tradeInputRetriever.loadLeague(leagueId, seasonId, currentWeek).then((league) => {
    var bestTradesMap = tradeRecommender.findBestTrades(league);
    tradeOutputStorer.saveTrades(league, bestTradesMap, currentWeek);
  });
}

function loadTrades(leagueId, seasonId, currentWeek) {
  var tradeOutputRetriever = new FileBasedTradeOutputRetriever(tradeOutputJsonFilePath);
  tradeOutputRetriever.loadTrades(leagueId, seasonId, currentWeek);
}

/**
 * Main entry point.
 */
//loadLeague(leagueId, seasonId, currentWeek);
generateTrades(leagueId, seasonId, currentWeek);
//loadTrades(leagueId, seasonId, currentWeek);