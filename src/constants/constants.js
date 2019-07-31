// TODO remove from git
const espnS2 = 'AEAf1D5gZBZ9lBDPyQsPct6fXgqDyp20ASePIkUI9czhthLqMznpMNjZ28WV4kpN18IgDeqS8v9TxfrL9X52W%2BNwH9yh4wQ00LwqNx6q6rNRmwp0iJR%2BYvyBZd9qGGo%2FLCuIfqVeS39bnBqV6TcNa7B5U9NwhAOvZOZObtOHw4u%2FyuZUzX0VVad6WZ%2BbSTth1vA%2BKalC%2FK65r6mwz9gNtBsxuMtBYeNmR5KakYUHrACdqXZrL28oDX2i5vL3juv82UBSsxGQJUt57XM%2BnSJ7wLTw';
const swid = '{3294F6C0-4FC6-44FD-A472-72A282960E4F}';

// These should be instance variables of league, and I can pass league around as a singleton
const leagueId = 7538631;
const seasonId = 2019;
const numWeeksInSeason = 16;
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

const maxLineupSlots = {
  '0': 3, 
  '2': 3, 
  '4': 2, 
  '6': 2, 
  '16': 1, 
  '17': 1, 
}

export {
  espnS2,
  swid,
  leagueId,
  seasonId,
  numWeeksInSeason,
  startingLineupSlots,
  maxLineupSlots
};