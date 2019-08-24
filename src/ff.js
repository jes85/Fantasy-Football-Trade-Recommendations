import _ from 'lodash';
import { PerformanceObserver, performance } from 'perf_hooks';

import EspnClient from './clients/EspnClient.js';
import CsvClient from './clients/CsvClient.js';

import EspnClientTradeInputRetriever from './data/input/EspnClientTradeInputRetriever.js';
import ConsoleTradeInputStorer from './data/input/ConsoleTradeInputStorer.js';
import FileBasedTradeInputRetriever from './data/input/FileBasedTradeInputRetriever.js';
import FileBasedTradeInputStorer from './data/input/FileBasedTradeInputStorer.js';

import TradeEvaluator from './computations/TradeEvaluator.js';
import TradeEnumerator from './computations/TradeEnumerator.js';
import TradeRecommender from './computations/TradeRecommender.js';
import ConsoleTradeOutputStorer from './data/output/ConsoleTradeOutputStorer.js';
import FileBasedTradeOutputStorer from './data/output/FileBasedTradeOutputStorer.js';
import FileBasedTradeOutputRetriever from './data/output/FileBasedTradeOutputRetriever.js';
import TradeOutput from './data/output/TradeOutput.js';

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
var espnClient = new EspnClient(espnS2, SWID);
var csvClient = new CsvClient();

function loadPlayers(leagueId, seasonId) {
  var espnPlayers = [];
  //return espnClient.getProTeamIdToByeWeekMap(seasonId).then((proTeamIdToByeWeekMap) => {
    //return espnClient.getPlayers(leagueId, seasonId, proTeamIdToByeWeekMap).then((espnPlayers, teamIdToPlayersMap) => {
      var fantasyProsPlayers = csvClient.getPlayers(seasonId);
      _.each(espnPlayers, (espnPlayer) => {
        var fantasyProPlayer = fantasyProsPlayers[espnPlayer.fullName];
        if (fantasyProPlayer) {
          console.log(`Changing expected points for ${espnPlayer.fullName} from ${espnPlayer.totalExpectedPoints2019} to ${fantasyProPlayer.totalExpectedPoints2019}`);
          espnPlayer.totalExpectedPoints2019 = fantasyProPlayer.totalExpectedPoints2019;
        } else {
          console.error("No fantasyPro player named " + espnPlayer.fullName);
        }
      });
      return espnPlayers;
    //});
  //});
}
function loadLeague(leagueId, seasonId, currentWeek) {
  var tradeInputRetriever = new EspnClientTradeInputRetriever(espnClient);
  var tradeInputStorer = new FileBasedTradeInputStorer(tradeInputJsonFilePath, tradeInputJsFilePath);

  tradeInputRetriever.loadLeague(leagueId, seasonId, currentWeek).then((league) => {
    tradeInputStorer.saveLeague(league);
  });
}

function generateTrades(leagueId, seasonId, currentWeek) {
  var t0 = performance.now();

  // var espnClient = new EspnClient(espnS2, SWID);
  // var tradeInputRetriever = new EspnClientTradeInputRetriever(espnClient);
  var tradeInputRetriever = new FileBasedTradeInputRetriever(tradeInputJsonFilePath, csvClient);
  var tradeEnumerator = new TradeEnumerator();
  var tradeEvaluator = new TradeEvaluator();
  var tradeRecommender = new TradeRecommender(tradeEnumerator, tradeEvaluator);
  //var tradeOutputStorer = new ConsoleTradeOutputStorer();
  var tradeOutputStorer = new FileBasedTradeOutputStorer(tradeOutputJsonFilePath, tradeOutputJsFilePath);

  tradeInputRetriever.loadLeague(leagueId, seasonId, currentWeek).then((league) => {
    var bestTradesMap = tradeRecommender.findBestTrades(league);
    var tradeOutput = new TradeOutput(leagueId, seasonId, currentWeek, bestTradesMap);
    tradeOutputStorer.saveTrades(tradeOutput);
    var t1 = performance.now();
    console.log("Time (ms): " + (t1 - t0));
  });
}

function loadTrades(leagueId, seasonId, currentWeek) {
  var tradeOutputRetriever = new FileBasedTradeOutputRetriever(tradeOutputJsonFilePath);
  tradeOutputRetriever.loadTrades(leagueId, seasonId, currentWeek);
}

/**
 * Main entry point.
 */
//loadPlayers(leagueId, seasonId);
var fantasyProsPlayers = csvClient.getPlayers(seasonId);
//loadLeague(leagueId, seasonId, currentWeek);
generateTrades(leagueId, seasonId, currentWeek);
//loadTrades(leagueId, seasonId, currentWeek);