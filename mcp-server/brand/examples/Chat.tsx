import { useChat } from "ai/react";

function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <form onSubmit={handleSubmit}>
      {messages.map((m) => (
        <div key={m.id}>{m.content}</div>
      ))}
      <input value={input} onChange={handleInputChange} />
    </form>
  );
}

export default Chat;
