import type { ChatMessage } from "../../hooks/useChat";
import TypingBubble from "../mascot/TypingBubble";
import MessageBubble from "./MessageBubble";

interface MessageListProps {
  messages: ChatMessage[];
  speakingId: string;
  speakingText: string;
  pending: boolean;
}

const MessageList: React.FC<MessageListProps> = (props) => {
  return (
    <ol className="flex flex-1 flex-col gap-4 px-4 py-4">
      {props.messages.map((message) => (
        <li key={message.id}>
          <MessageBubble message={message} text={message.id === props.speakingId ? props.speakingText : message.text} />
        </li>
      ))}
      {props.pending && (
        <li>
          <TypingBubble />
        </li>
      )}
    </ol>
  );
};

export default MessageList;
