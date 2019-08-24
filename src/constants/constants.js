// TODO Retrieve theses values from espn for each league 

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
  '0': 2, 
  '2': 4, 
  '4': 4, 
  '6': 2, 
  '16': 1, 
  '17': 1, 
}

export {
  numWeeksInSeason,
  startingLineupSlots,
  maxLineupSlots
};