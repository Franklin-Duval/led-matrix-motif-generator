import {
  Button,
  Divider,
  Input,
  message,
  Modal,
  Popconfirm,
  Space,
  Tabs,
} from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { useState } from 'react';
import '../../assets/global-css/display.css';
import AppAnimation from '../../entities/Animation';
import clone from '../../functions/clone';
import translateDown from '../../functions/translateFrameDown';
import translateLeft from '../../functions/translateFrameLeft';
import translateRight from '../../functions/translateFrameRight';
import translateUp from '../../functions/translateFrameUp';
import { generateZeroFrame, ZeroMatrix } from '../shared/conts';
import { AnimationCard } from './components/AnimationCard';
import { Matrix } from './components/Matrix';

export const GeneratorPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [numMatrice, setNumMatrice] = useState(0);
  const [listMatrice, setListMatrice] = useState<number[][][]>([ZeroMatrix()]);
  const [selectedKey, setSelectedKey] = useState<number>(0);
  const [myAnimation, setMyAnimation] = useState<number[][][][]>([listMatrice]);
  const [outputs, setOutputs] = useState<string[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState<number>(300);
  const [animationID, setAnimationID] = useState<NodeJS.Timeout>();
  const [clipboard, setClipboard] = useState<number[][][]>([]);

  const startAnimation = () => {
    const looper = setInterval(() => {
      if (selectedKey + 1 !== myAnimation.length) {
        console.log('selectedKey is ', selectedKey);

        setSelectedKey((selectedKey) => selectedKey + 1);
      } else {
        setSelectedKey(0);
      }
    }, animationSpeed);
    setAnimationID(looper);
  };

  const stopAnimation = () => {
    console.log(
      'Stopping animation with animation length to ',
      myAnimation.length,
    );

    clearInterval(animationID as NodeJS.Timeout);
  };

  const copyToClipboard = () => {
    setClipboard(listMatrice);
  };

  function saveFrame() {
    message.success('Frame saved successfully!');
  }

  /* const resetMatrix = (matrix: number[][]) => {
    if (ref.current !== null) {
      ref.current.reset(matrix);
    }
  }; */

  function selectMatrix(key: number) {
    console.log(
      'Select ',
      key,
      'in',
      myAnimation,
      'while current key is ',
      selectedKey,
      'corresponding to',
      listMatrice,
    );

    setListMatrice(myAnimation[key]);
    setSelectedKey(key);

    console.log('the now selected is', myAnimation[key], 'with  key', key);
  }

  function initMatrix() {
    const newListMatrice = generateZeroFrame(numMatrice);
    setListMatrice(newListMatrice);
    setMyAnimation([newListMatrice]);
  }

  const generateCode = () => {
    console.log(listMatrice);
    const animation = new AppAnimation(myAnimation);
    const rawAnimation = animation.toRawAnimation();
    const res = rawAnimation.export();
    console.log(res);
    setOutputs(res);
    message.success('Code generated!');
  };

  const newFrame = () => {
    message.info('New frame created!');
    const generatedFrame = generateZeroFrame(numMatrice);
    myAnimation.push(generatedFrame);
    setMyAnimation(myAnimation);
    selectMatrix(myAnimation.length - 1);
    setListMatrice(generatedFrame);
  };

  const transLeft = () => {
    message.info('translating frame...');
    const newFrame = translateLeft(listMatrice);
    myAnimation[selectedKey] = newFrame;
    setMyAnimation(myAnimation);
    setListMatrice(newFrame);
  };

  const transRight = () => {
    message.info('translating frame...');
    const newFrame = translateRight(listMatrice);
    myAnimation[selectedKey] = newFrame;
    setMyAnimation(myAnimation);
    setListMatrice(newFrame);
  };

  const transUp = () => {
    message.info('translating frame...');
    const newFrame = translateUp(listMatrice);
    myAnimation[selectedKey] = newFrame;
    setMyAnimation(myAnimation);
    setListMatrice(newFrame);
  };

  const transDown = () => {
    message.info('translating frame...');
    const newFrame = translateDown(listMatrice);
    myAnimation[selectedKey] = newFrame;
    setMyAnimation(myAnimation);
    setListMatrice(newFrame);
  };

  const duplicate = () => {
    message.info('Frame duplicated!');
    myAnimation.splice(selectedKey, 0, clone(listMatrice));
    setMyAnimation(myAnimation);
    setListMatrice(myAnimation[selectedKey + 1]);
    selectMatrix(selectedKey + 1);
  };

  const deleteFrame = () => {
    message.info('Frame deleted!');
    const res = [];
    for (let i = 0; i < myAnimation.length; i++) {
      if (i !== selectedKey) {
        res.push(myAnimation[i]);
      }
    }
    setMyAnimation(res);
    selectMatrix(0);
  };

  return (
    <div style={{ marginLeft: 50 }}>
      <Modal
        visible={isModalVisible}
        title='Informations'
        onCancel={() => setIsModalVisible(!isModalVisible)}
        footer={null}
        maskClosable={false}
      >
        <h2 style={{ textAlign: 'center' }}>
          Combien de matrices à LED avez vous ?
        </h2>
        <Space
          direction='vertical'
          style={{ alignItems: 'center', width: '100%' }}
        >
          <Input
            placeholder='nombre de produit'
            onChange={(event) => {
              setNumMatrice(Number(event.target.value));
            }}
          />
          <Button
            type='primary'
            onClick={() => {
              setIsModalVisible(false);
              initMatrix();
            }}
          >
            Continuer
          </Button>
        </Space>
      </Modal>

      <h1>Generator Page</h1>
      <Button onClick={copyToClipboard}>Copy to clipboard</Button>
      <Button onClick={() => setListMatrice(clipboard)}>Paste</Button>
      <div className='horizontal-scroll'>
        {listMatrice.map((item, index) => (
          <Matrix
            index={index}
            key={index}
            onUpdate={(value: number[][]) => {
              console.log('Update display from', listMatrice, 'to ', value);

              let newValue: number[][][] = listMatrice.map((item, key) =>
                key === index ? value : item,
              );
              setListMatrice(newValue);
            }}
            value={item}
            /* ref={ref} */
          />
        ))}
      </div>

      <Space style={{ marginTop: 50 }}>
        <Button size='large' onClick={startAnimation}>
          Play
        </Button>
        <Button size='large' onClick={stopAnimation}>
          Stop
        </Button>
        <Button size='large' onClick={transLeft}>
          Left
        </Button>
        <Button size='large' onClick={transRight}>
          Right
        </Button>
        <Button size='large' onClick={transUp}>
          Up
        </Button>
        <Button size='large' onClick={transDown}>
          Down
        </Button>
        <Button onClick={duplicate} size='large'>
          Dupliquer
        </Button>
        <Button type='primary' size='large' onClick={saveFrame}>
          Sauveguarder le motif
        </Button>
        <Button type='default' size='large' onClick={newFrame}>
          Nouveau motif
        </Button>
        <Popconfirm
          title='Are you sure you want to delete this frame?'
          onConfirm={deleteFrame}
        >
          <Button danger type='default' size='large'>
            Supprimer le motif
          </Button>
        </Popconfirm>
        <Button size='large' type='primary' onClick={generateCode}>
          Generate Code
        </Button>
      </Space>

      <h2 style={{ marginTop: 20 }}>Animations</h2>
      <div className='animation-box horizontal-scroll'>
        {myAnimation.map((frame, key) => (
          <AnimationCard
            key={key}
            index={key}
            frame={frame}
            activated={selectedKey === key}
            onClick={() => {
              selectMatrix(key);
            }}
          />
        ))}
      </div>

      <Tabs defaultActiveKey='1' style={{ marginTop: 20 }}>
        {[...Array(numMatrice)].map((val, index) => (
          <Tabs.TabPane tab={`Fichier ${index + 1}`} key={index + 1}>
            <Space direction='vertical' size={10}>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(outputs[index]);
                  message.success(
                    `Content of file ${index + 1} copied to clipboard!`,
                  );
                }}
              >
                Copy to clipboard
              </Button>
              <Divider />
              <Paragraph style={{ fontSize: '1.5em' }}>
                {outputs[index]}
              </Paragraph>
            </Space>
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};
