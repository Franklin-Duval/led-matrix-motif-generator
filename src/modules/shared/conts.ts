export const ZeroMatrix = (): number[][] => [
  [...Array(8).fill(0)],
  [...Array(8).fill(0)],
  [...Array(8).fill(0)],
  [...Array(8).fill(0)],
  [...Array(8).fill(0)],
  [...Array(8).fill(0)],
  [...Array(8).fill(0)],
  [...Array(8).fill(0)],
];

export const generateZeroFrame = (numMatrice: number): number[][][] => {
  console.log('init matrices');
  console.log(numMatrice);

  let init: [number[][]] = [ZeroMatrix()];
  for (let i = 1; i < numMatrice; i++) {
    init.push(ZeroMatrix());
  }

  return init;
};
