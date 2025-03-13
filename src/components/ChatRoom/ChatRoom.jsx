import React, { useEffect, useState } from "react";
import styles from "./ChatRoom.module.css";
import { useAuthContext } from "../../contexts/AuthContext";
import { AiOutlineArrowLeft } from "react-icons/ai";
import { socket } from "../../App.js";
// Initialize the socket instance outside the component

const ChatRoom = ({
  buyerId,
  sellerId,
  messages,
  setMessages,
  handleBackToChatList,
  selectedConversation,
}) => {
  const { user_id } = useAuthContext().userState;
  const [conversationId, setConversationId] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      setIsMobileView(isMobile);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (socket.connected) {
      console.log("Socket connected");
    } else {
      console.log("Socket not connected");
    }
  }, []);

  useEffect(() => {
    console.log("Joining Conversation");
    socket.emit("joinConversation", { buyerId, sellerId });

    const handleLoadingMessages = ({ loadedMessages, conversation_id }) => {
      setMessages(loadedMessages);
      setConversationId(conversation_id);
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
      setMessages((prevMessages) => [...prevMessages, data]);
    };
    socket.on("receiveMessage", handleReceiveMessage);
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [buyerId, sellerId]);

  useEffect(() => {
    const unseenMessages = messages.filter(
      (msg) => msg.receiver_id == user_id && msg.status !== "read"
    );
    if (unseenMessages.length > 0) {
      socket.emit("markMessagesAsRead", {
        conversationId,
        messageIds: unseenMessages.map((msg) => msg.message_id),
      });
    }
  }, [conversationId, messages]);

  useEffect(() => {
    const handleMessagesMarkedAsRead = (messageIds) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          messageIds.includes(msg.message_id) ? { ...msg, status: "read" } : msg
        )
      );
    };

    socket.on("messagesMarkedAsRead", handleMessagesMarkedAsRead);

    return () => {
      socket.off("messagesMarkedAsRead", handleMessagesMarkedAsRead);
    };
  }, []);

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
      {isMobileView && (
        <div className={styles.header}>
          <button className={styles.backButton} onClick={handleBackToChatList}>
            <AiOutlineArrowLeft size={20} />
          </button>
          {selectedConversation?.other_user_name}
        </div>
      )}
      <div className={styles.messagesContainer}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`${styles.message} ${
              msg.sender_id == user_id ? styles.sent : styles.received
            }`}
          >
            <span>{msg.message}</span>
            <span className={styles.sentAt}>
              {new Date(msg.sent_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {msg.sender_id == user_id && (
              <div className={styles.tick}>
                {msg.status == "read" ? "✔✔" : "✔"}
              </div>
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
