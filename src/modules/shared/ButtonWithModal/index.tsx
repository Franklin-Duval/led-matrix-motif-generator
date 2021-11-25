import { Button, ButtonProps, Modal } from 'antd';
import { useState } from 'react';

export const ButtonWithModal = ({
  buttonText,
  children,
  modalProps,
  buttonProps,
}: {
  buttonText: React.ReactNode;
  children: (closeModal: () => void) => React.ReactNode;
  modalProps: Parameters<typeof Modal>[0];
  buttonProps?: ButtonProps;
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const closeModal = () => setIsModalVisible(false);
  return (
    <>
      <Button
        onClick={() => setIsModalVisible(true)}
        type='primary'
        style={{ display: 'flex', alignItems: 'center' }}
        {...buttonProps}
      >
        {buttonText}
      </Button>
      <Modal
        visible={isModalVisible}
        onCancel={closeModal}
        footer={null}
        {...modalProps}
      >
        {children(closeModal)}
      </Modal>
    </>
  );
};
