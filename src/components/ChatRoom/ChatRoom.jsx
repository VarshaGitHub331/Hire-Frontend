import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import styles from "./ChatRoom.module.css";
import { useAuthContext } from "../../contexts/AuthContext";

// Initialize the socket instance outside the component
const socket = io("http://localhost:3001");

const ChatRoom = ({ buyerId, sellerId }) => {
  const [messages, setMessages] = useState([]);
  const { user_id } = useAuthContext().userState;
  const [conversationId, setConversationId] = useState("");
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (socket.connected) {
      console.log("Socket connected");
    } else {
      console.log("Socket not connected");
    }
  }, []);

  useEffect(() => {
    console.log("Joining Conversation");
    console.log(buyerId);
    console.log(sellerId);
    socket.emit("joinConversation", { buyerId, sellerId });

    const handleLoadingMessages = ({ loadedMessages, conversation_id }) => {
      alert("loading conversation");
      console.log("Loading messages:", loadedMessages);
      setMessages((messages) => loadedMessages);
      setConversationId((conversationId) => conversation_id);
    };

    // Attach listeners
    socket.on("loadingMessages", handleLoadingMessages);

    // Cleanup on unmount or dependency change
    return () => {
      socket.off("loadingMessages", handleLoadingMessages);
    };
  }, [buyerId, sellerId]);
  useEffect(() => {
    const handleReceiveMessage = (data) => {
      console.log("Received message:", data);
      setMessages((prevMessages) => [...prevMessages, data]);
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [buyerId, sellerId]);

  const handlePostMessage = () => {
    if (newMessage.trim()) {
      socket.emit("sendMessage", {
        conversationId,
        senderId: user_id,
        receiverId: user_id == buyerId ? sellerId : buyerId,
        message: newMessage.trim(),
      });
      setNewMessage(""); // Clear the input field after sending
    }
  };

  return (
    <div className={styles.chatRoom}>
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender_id == user_id ? styles.sent : styles.received
            }`}
          >
            {/* Display the message */}
            <span>{msg.message}</span>

            {/* Display the formatted sent_at time */}
            <span className={styles.sentAt}>
              {new Date(msg.sent_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              {/* Or use toLocaleString() for date and time */}
            </span>

            {/* Check if the sender is the current user and conditionally render tick based on message status */}
            {msg.sender_id == user_id && (
              <span className={styles.tick}>
                {/* Display two ticks for 'read' and one tick for 'unread' */}
                {msg.status == "read" ? "✔✔" : "✔"}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handlePostMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
