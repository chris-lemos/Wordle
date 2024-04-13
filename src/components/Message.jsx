import { useGame } from "../context/gameContext";
function Message() {
  const { message } = useGame();

  if (message) return <div className="message">{message}</div>;
  else return <></>;
}

export default Message;
