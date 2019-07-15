// TODO make seasonId configurable, retrieve the others from espn 
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
  seasonId,
  numWeeksInSeason,
  startingLineupSlots,
  maxLineupSlots
};