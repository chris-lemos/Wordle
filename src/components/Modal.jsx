import { useGame } from "../context/gameContext";
import { useRef, useEffect } from "react";
import Help from "./Help";
import Stats from "./Stats";

function Modal() {
  const { activeModalType, dispatch } = useGame();
  const modalRef = useRef(null);

  useEffect(() => {
    if (activeModalType) modalRef.current.showModal();
  }, [modalRef.current, activeModalType]);

  const closeModal = () => {
    modalRef.current.close();
    dispatch({ type: "modal/close" });
    document.activeElement.blur();
  };

  const modalComponents = {
    help: <Help closeModal={closeModal}></Help>,
    stats: <Stats closeModal={closeModal}></Stats>,
  };

  return <dialog ref={modalRef}>{modalComponents?.[activeModalType]}</dialog>;
}

export default Modal;
