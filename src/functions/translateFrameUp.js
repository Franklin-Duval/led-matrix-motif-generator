import clone from './clone';

const translateUp = (frame) => {
  let res = clone(frame);
  for (let matrix of res) {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 8; j++) {
        matrix[i][j] = matrix[i + 1][j];
      }
    }

    for (let i = 0; i < 8; i++) {
      matrix[7][i] = 0;
    }
  }

  return res;
};

export default translateUp;
