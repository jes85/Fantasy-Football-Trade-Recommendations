const maxPlayersPerTrade = 2;
const currentWeek = 3;
const seasonId = 2019;

const leagueJsonFilePath = '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/leagues.json';
const leagueJsFilePath = '/Users/jeremyschreck/Developer/react/ff/src/data/leagues.js';
const playerProjectionsJsonFilePath = '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/playerProjections.json';

const tradeOutputJsonFilePath = '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/bestTrades.json';
const postProcessedTradeOutputJsonFilePath = '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/bestTradesPostProcessed.json';
const tradeOutputJsFilePath = '/Users/jeremyschreck/Developer/react/ff/src/data/bestTrades.js';

const projectionCsvs = [
  '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/CBS_Projections_QB.csv',
  '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/CBS_Projections_RB.csv',
  '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/CBS_Projections_WR.csv',
  '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/CBS_Projections_TE.csv',
  '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/CBS_Projections_DST.csv',
  '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/CBS_Projections_K.csv'
];

// const projectionCsvs = [
//   '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/FantasyPros_Fantasy_Football_Projections_QB.csv',
//   '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/FantasyPros_Fantasy_Football_Projections_RB.csv',
//   '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/FantasyPros_Fantasy_Football_Projections_WR.csv',
//   '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/FantasyPros_Fantasy_Football_Projections_TE.csv',
//   '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/FantasyPros_Fantasy_Football_Projections_DST.csv',
//   '/Users/jeremyschreck/Developer/ff/src/projections/CurrentWeek/FantasyPros_Fantasy_Football_Projections_K.csv'
// ];

// TODO Retrieve theses values from espn for each league
const numWeeksInSeason = 17;

// 1 QB, 2 RB, 2 WR, 1 TE, 1 D/ST, 1 K, 1 RB/WR/TE (Flex)
// todo combine lineup maps
const startingLineupSlots = {
  '0': 1,
  '2': 2,
  '4': 2,
  '6': 1,
  '16': 1,
  '17': 1,
  '23': 1
};

// This is only used for experimentation to create fake teams before drafts.
const maxLineupSlots = {
  '0': 2,
  '2': 4,
  '4': 4,
  '6': 2,
  '16': 1,
  '17': 1,
}

export {
  maxPlayersPerTrade,
  currentWeek,
  seasonId,
  leagueJsonFilePath,
  leagueJsFilePath,
  playerProjectionsJsonFilePath,
  tradeOutputJsonFilePath,
  postProcessedTradeOutputJsonFilePath,
  tradeOutputJsFilePath,
  numWeeksInSeason,
  startingLineupSlots,
  maxLineupSlots,
  projectionCsvs
}