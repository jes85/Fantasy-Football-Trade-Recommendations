import _ from 'lodash';
import { PerformanceObserver, performance } from 'perf_hooks';

import EspnClient from './clients/EspnClient.js';

import EspnClientTradeInputRetriever from './data/input/EspnClientTradeInputRetriever.js';
// todo rename file to json
import FileBasedTradeInputRetriever from './data/input/FileBasedTradeInputRetriever.js';
import CsvClientTradeInputRetriever from './data/input/CsvClientTradeInputRetriever.js';
import ConsoleTradeInputStorer from './data/input/ConsoleTradeInputStorer.js';
import FileBasedTradeInputStorer from './data/input/FileBasedTradeInputStorer.js';
import EspnPlayerPointsProjector from './computations/EspnPlayerPointsProjector.js';
import EspnTeamPointsProjector from './computations/EspnTeamPointsProjector.js';
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
  maxPlayersPerTrade,
  currentWeek,
  seasonId,
  leagueJsonFilePath,
  leagueJsFilePath,
  playerProjectionsJsonFilePath,
  tradeOutputJsonFilePath,
  tradeOutputJsFilePath} from './configuration.js';


/**
 * Wire in classes.
 * TODO dependency injection
 */
var espnClient = new EspnClient(espnS2, SWID);

function loadPlayerProjectionsFromCsvToFile(leagueId, seasonId) {
  const tradeInputRetriever = new CsvClientTradeInputRetriever();
  const tradeInputStorer = new FileBasedTradeInputStorer(leagueJsonFilePath, leagueJsFilePath, playerProjectionsJsonFilePath);
  const playerProjections = tradeInputRetriever.loadPlayerProjections(leagueId, seasonId);
  tradeInputStorer.savePlayerProjections(playerProjections);
}

function loadLeagueFromEspnToFile(leagueId, seasonId, currentWeek) {
  const playerProjectionsRetriever = new FileBasedTradeInputRetriever(leagueJsonFilePath, playerProjectionsJsonFilePath);
  const leagueRetriever = new EspnClientTradeInputRetriever(espnClient);
  const tradeInputStorer = new FileBasedTradeInputStorer(leagueJsonFilePath, leagueJsFilePath);

  const playerProjections = playerProjectionsRetriever.loadPlayerProjections(seasonId, currentWeek);
  leagueRetriever.loadLeague(leagueId, seasonId, currentWeek).then((league) => {
    _.each(league.teams, (team) => {
      _.each(team.players, (player) => {
        if (!_.has(playerProjections, player.fullName)) {
          console.warn(`No player projections exist for player ${player.fullName} on team ${team.nickname} in league ${leagueId}`);
        }
      });
    });
    tradeInputStorer.saveLeague(league);
  });
}

function generateTradesFromFileToFile(leagueId, seasonId, currentWeek) {
  const tradeInputRetriever = new FileBasedTradeInputRetriever(leagueJsonFilePath, playerProjectionsJsonFilePath);
  const tradeOutputStorer = new FileBasedTradeOutputStorer(tradeOutputJsonFilePath, tradeOutputJsFilePath);
  //const tradeOutputStorer = new ConsoleTradeOutputStorer();

  const t0 = performance.now();
  const playerProjections = tradeInputRetriever.loadPlayerProjections(seasonId, currentWeek);
  const playerPointsProjector = new EspnPlayerPointsProjector(playerProjections);
  const teamPointsProjector = new EspnTeamPointsProjector(playerPointsProjector);
  const tradeEnumerator = new TradeEnumerator(teamPointsProjector, maxPlayersPerTrade);
  const tradeEvaluator = new TradeEvaluator();
  const tradeRecommender = new TradeRecommender(tradeEnumerator, tradeEvaluator);
  tradeInputRetriever.loadLeague(leagueId, seasonId, currentWeek).then((league) => {
    const bestTradesMap = tradeRecommender.findBestTrades(league);
    const tradeOutput = new TradeOutput(leagueId, seasonId, currentWeek, bestTradesMap);
    tradeOutputStorer.saveTrades(tradeOutput);
    const t1 = performance.now();
    console.log("Time (ms): " + (t1 - t0));
  });
}

function loadTrades(leagueId, seasonId, currentWeek) {
  const tradeOutputRetriever = new FileBasedTradeOutputRetriever(tradeOutputJsonFilePath);
  const tradeOutputStorer = new ConsoleTradeOutputStorer();

  const tradeOutput = tradeOutputRetriever.loadTrades(leagueId, seasonId, currentWeek);
  tradeOutputStorer.saveTrades(tradeOutput);
}

/**
 * Main entry point.
 */
//loadPlayerProjectionsFromCsvToFile(leagueId, seasonId);
//loadLeagueFromEspnToFile(leagueId, seasonId, currentWeek);
generateTradesFromFileToFile(leagueId, seasonId, currentWeek);
//loadTradesFromFileToConsole(leagueId, seasonId, currentWeek);