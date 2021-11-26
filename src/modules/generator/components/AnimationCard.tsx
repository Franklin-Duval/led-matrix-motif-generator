import { Card } from 'antd';

export const AnimationCard = ({
  frame,
  index,
}: {
  frame: [number[][]];
  index: number;
}) => {
  return (
    <Card
      title={`Animation ${index}`}
      style={{ width: 200, margin: 5 }}
      onClick={() => console.log(index)}
      hoverable
    >
      <h2
        style={{ fontFamily: 'Montserrat', fontSize: 40, textAlign: 'center' }}
      >
        {index}
      </h2>
    </Card>
  );
};
