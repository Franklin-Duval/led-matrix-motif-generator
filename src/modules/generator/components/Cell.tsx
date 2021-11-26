import { useState } from 'react';

export const Cell = ({ onChange }: { onChange: () => void }) => {
  const [clicked, setClicked] = useState(false);

  return (
    <div
      className={clicked ? 'cell-selected' : 'cell'}
      onClick={() => {
        onChange();
        setClicked(!clicked);
      }}
    ></div>
  );
};
