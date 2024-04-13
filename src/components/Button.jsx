import { useGame } from "../context/gameContext";

function Button({ children, actions, closeModal, className }) {
  const { dispatch } = useGame();

  const handleClick = () => {
    if (actions) {
      if (Array.isArray(actions)) {
        actions.forEach((act) => {
          dispatch({
            type: act.type,
            payload: act.payload || undefined,
          }),
            closeModal && closeModal();
        });
      } else {
        dispatch({ type: actions.type, payload: actions.payload || undefined });
      }
    }
    closeModal && closeModal();
  };

  return (
    <button className={className} onClick={handleClick}>
      {children}
    </button>
  );
}

export default Button;
