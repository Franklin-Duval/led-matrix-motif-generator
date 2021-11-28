import clone from './clone';

const translateLeft = (display) => {
  let res = clone(display);
  for (let matrix = res.length - 1; matrix >= 0; matrix--) {
    for (let i = 0; i < 8; i++) {
      for (let j = 7; j >= 0; j--) {
        if (j >= 1) {
          res[matrix][i][j] = res[matrix][i][j - 1];
        } else {
          if (matrix !== 0) {
            res[matrix][i][0] = res[matrix - 1][i][7];
          } else {
            res[matrix][i][0] = 0;
          }
        }
      }
    }
  }

  return res;
};

export default translateLeft;
