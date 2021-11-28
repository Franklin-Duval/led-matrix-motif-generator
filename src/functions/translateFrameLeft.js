import clone from './clone';

const translateLeft = (display) => {
  let res = clone(display);
  for (let matrix in res) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 7; j++) {
        res[matrix][i][j] = res[matrix][i][j + 1];
      }
    }
    if (Number(matrix) === res.length - 1) {
      for (let i = 0; i < 8; i++) {
        res[matrix][i][7] = 0;
      }
    } else {
      for (let i = 0; i < 8; i++) {
        res[matrix][i][7] = res[Number(matrix) + 1][i][0];
      }
    }
  }

  return res;
};

export default translateLeft;
