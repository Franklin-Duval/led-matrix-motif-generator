import { Card } from 'antd';

export const AnimationCard = ({
  frame,
  index,
  activated,
  onClick,
}: {
  frame: number[][][];
  index: number;
  activated: boolean;
  onClick: any;
}) => {
  /* return (
    <div
      className={activated ? 'mini-selected-frame' : 'mini-frame'}
      onClick={onClick}
    >
      {index}
    </div>
  ); */
  return (
    <Card
      title={`Animation ${index}`}
      style={{ width: 200, margin: 5 }}
      onClick={onClick}
      hoverable
      className={activated ? 'mini-selected-frame' : 'mini-frame'}
    >
      <h2
        style={{ fontFamily: 'Montserrat', fontSize: 40, textAlign: 'center' }}
      >
        {index}
      </h2>
    </Card>
  );
};
