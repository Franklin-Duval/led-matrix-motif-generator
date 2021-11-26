import { Button, Divider, Input, message, Modal, Space, Tabs } from 'antd';
import Paragraph from 'antd/lib/typography/Paragraph';
import { useState } from 'react';
import '../../assets/global-css/display.css';
import AppAnimation from '../../entities/Animation';
import { Matrix } from './components/Matrix';

export const GeneratorPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [numMatrice, setNumMatrice] = useState(0);
  const [listMatrice, setListMatrice] = useState<[number[][]]>([[]]);
  const [outputs, setOutputs] = useState<string[]>([]);

  const saveFrame = () => {
    console.log(listMatrice);
    const animation = new AppAnimation([listMatrice]);
    const rawAnimation = animation.toRawAnimation();
    const res = rawAnimation.export();
    console.log(res);
    setOutputs(res);
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
            onChange={(event) => setNumMatrice(Number(event.target.value))}
          />
          <Button type='primary' onClick={() => setIsModalVisible(false)}>
            Continuer
          </Button>
        </Space>
      </Modal>

      <h1>Generator Page</h1>
      <div className='horizontal-scroll'>
        {[...Array(numMatrice).fill(0)].map((item, index) => (
          <Matrix
            key={index}
            getListMatrice={(value: number[][]) => {
              listMatrice[index] = value;
              setListMatrice(listMatrice);
            }}
          />
        ))}
      </div>

      <Space style={{ marginTop: 50 }}>
        <Button type='primary' size='large' onClick={saveFrame}>
          Sauveguarder le motif
        </Button>
        <Button type='default' size='large'>
          Nouveau motif
        </Button>
        <Button danger type='default' size='large'>
          Supprimer le motif
        </Button>
      </Space>

      <Tabs defaultActiveKey='1' style={{ marginTop: '50px' }}>
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
