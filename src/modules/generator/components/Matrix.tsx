import React from 'react';
import { Cell } from './Cell';

export const Matrix = ({
  onUpdate,
  value,
  index,
}: {
  value: number[][];
  onUpdate: (value: number[][]) => void;
  index: number;
}) => {
  const Cells = [];

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      Cells.push(
        <Cell
          key={`${i}${j}`}
          value={Boolean(value[i][j])}
          index={[i, j]}
          onToggle={() => {
            /* if (value[i][j] === 0) {
              value[i][j] = 1;
            } else {
              value[i][j] = 0;
            } */
            value[i][j] = (value[i][j] + 1) % 2;
            console.log('Update matrix no : ', index, 'to State ', value);

            onUpdate(value);
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
