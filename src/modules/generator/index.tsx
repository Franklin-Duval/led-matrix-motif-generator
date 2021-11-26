import { Button, Input, Modal, Space } from 'antd';
import { useState } from 'react';
import '../../assets/global-css/display.css';
import { Matrix } from './components/Matrix';

export const GeneratorPage = () => {
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [numMatrice, setNumMatrice] = useState(0);
  const [listMatrice, setListMatrice] = useState<[number[][]]>([[]]);

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
        <Button
          type='primary'
          size='large'
          onClick={() => console.log(listMatrice)}
        >
          Sauveguarder le motif
        </Button>
        <Button type='default' size='large'>
          Nouveau motif
        </Button>
        <Button danger type='default' size='large'>
          Supprimer le motif
        </Button>
      </Space>
    </div>
  );
};
