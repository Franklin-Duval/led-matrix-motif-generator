import clone from './clone';

const translateRight = (frame) => {
  let res = clone(frame);
  for (let matrix of res) {
    for (let i = 0; i < 8; i++) {
      for (let j = 7; j >= 1; j--) {
        matrix[i][j] = matrix[i][j - 1];
      }
    }

    for (let i = 0; i < 8; i++) {
      matrix[i][0] = 0;
    }
  }

  return res;
};

export default translateRight;
