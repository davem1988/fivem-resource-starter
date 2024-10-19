import { useState } from 'react';

type ModalType = string;

export const useModal = () => {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);

  const openModal = (modalType: ModalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return {
    activeModal,
    openModal,
    closeModal,
  };
};
