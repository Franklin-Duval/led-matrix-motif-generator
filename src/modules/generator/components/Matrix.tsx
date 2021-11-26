import React, { useState } from 'react';
import { Cell } from './Cell';

export const Matrix = ({
  getListMatrice,
}: {
  getListMatrice: (value: number[][]) => void;
}) => {
  const [matrixValue, setMatrixValue] = useState([
    [...Array(8).fill(0)],
    [...Array(8).fill(0)],
    [...Array(8).fill(0)],
    [...Array(8).fill(0)],
    [...Array(8).fill(0)],
    [...Array(8).fill(0)],
    [...Array(8).fill(0)],
    [...Array(8).fill(0)],
  ]);
  const Cells = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      Cells.push(
        <Cell
          key={`${i}${j}`}
          onChange={() => {
            if (matrixValue[i][j] === 0) {
              matrixValue[i][j] = 1;
            } else {
              matrixValue[i][j] = 0;
            }
            setMatrixValue(matrixValue);
            getListMatrice(matrixValue);
          }}
        />,
      );
    }
  }

  return (
    <div className='matrix-box'>
      <div className='matrix'>{Cells}</div>
    </div>
  );
};
