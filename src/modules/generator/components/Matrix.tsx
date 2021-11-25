import { Cell } from './Cell';

export const Matrix = () => {
  return (
    <div className='matrix'>
      {[...Array(64)].map((item, index) => (
        <Cell key={index} />
      ))}
    </div>
  );
};
