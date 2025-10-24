

export const ladders = {
  5: 53,
  14: 35,
  42: 18,
  53: 19,
  75: 19,
  64: 19,
};

export const snakes = {
  38: -18,
  45: -38,
  51: -41,
  76: -22,
  97: -36,
  91: -18,
};

export const getCellCoordinates = (position) => {
  const row = Math.floor((position - 1) / 10);
  const col = (position - 1) % 10;
  const isRightToLeft = row % 2 === 1;

  const x = isRightToLeft ? 9 - col : col;
  const y = 9 - row;

  return { x, y };
};
