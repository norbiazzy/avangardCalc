export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div className={message.type === "error" ? "toast error" : "toast"}>
      {message.text}
    </div>
  );
}
