import clone from './clone';

const translateLeft = (frame) => {
  let res = clone(frame);
  for (let matrix in res) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 7; j++) {
        res[matrix][i][j] = res[matrix][i][j + 1];
      }
    }
  }

  return res;
};

export default translateLeft;
