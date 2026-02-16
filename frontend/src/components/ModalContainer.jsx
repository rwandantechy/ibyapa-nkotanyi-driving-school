/* eslint-disable react/prop-types */
import { Modal } from "flowbite-react";

const ModalContainer = ({ children, modalTitle, modalSize, ...Otherprops }) => {
  return (
    <Modal size={modalSize ? modalSize : "md"} {...Otherprops}>
      {modalTitle && <Modal.Header>{modalTitle}</Modal.Header>}
      <Modal.Body>{children}</Modal.Body>
    </Modal>
  );
};

export default ModalContainer;
