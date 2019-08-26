const maxPlayersPerTrade = 2;
const currentWeek = 1;
const seasonId = 2019;

const leagueJsonFilePath = '/Users/jeremyschreck/Developer/ff/src/testing/leagues.json';
const leagueJsFilePath = '/Users/jeremyschreck/Developer/react/ff/src/data/leagues.js';
const playerProjectionsJsonFilePath = '/Users/jeremyschreck/Developer/ff/src/testing/playerProjections.json';

const tradeOutputJsonFilePath = '/Users/jeremyschreck/Developer/ff/src/testing/bestTrades.json';
const tradeOutputJsFilePath = '/Users/jeremyschreck/Developer/react/ff/src/data/bestTrades.js';

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
  tradeOutputJsFilePath,
  numWeeksInSeason,
  startingLineupSlots,
  maxLineupSlots
}