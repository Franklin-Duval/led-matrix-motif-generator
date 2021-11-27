export const Cell = ({
  onToggle,
  value,
  index,
}: {
  onToggle: () => void;
  value: boolean;
  index: number[];
}) => {
  return (
    <div
      className={value ? 'cell-selected' : 'cell'}
      onClick={() => {
        onToggle();
        console.log('Cell', index, 'clicked!');
      }}
    ></div>
  );
};
