import clone from './clone';

const translateLeft = (display) => {
  let res = clone(display);
  for (let matrix of res) {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 7; j++) {
        matrix[i][j] = matrix[i][j + 1];
      }
    }

    for (let i = 0; i < 8; i++) {
      matrix[i][7] = 0;
    }
  }

  return res;
};

export default translateLeft;
