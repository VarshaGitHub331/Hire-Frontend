import React, { useState, useEffect } from "react";
import ChatList from "../../components/ChatList/ChatList";
import ChatRoom from "../../components/ChatRoom/ChatRoom";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";
import styles from "./Chat.module.css";

const Chat = () => {
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState();
  const [buyerId, setBuyerId] = useState(location.state?.buyerId);
  const [sellerId, setSellerId] = useState(location.state?.sellerId);
  const { user_id } = useAuthContext().userState;
  const [messages, setMessages] = useState([]);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 768);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleBackToChatList = () => {
    setSelectedConversation(null);
  };

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
    if (selectedConversation) {
      setBuyerId(
        selectedConversation.role === "buyer"
          ? selectedConversation.user_id
          : selectedConversation.other_user_id
      );
      setSellerId(
        selectedConversation.role === "seller"
          ? selectedConversation.user_id
          : selectedConversation.other_user_id
      );
    } else {
      setBuyerId(null);
      setSellerId(null);
    }
  }, [selectedConversation]);

  return (
    <div className={styles.chatContainer}>
      <div
        className={`${styles.chatList} ${
          selectedConversation && isMobileView ? styles.hideList : ""
        }`}
      >
        <ChatList
          onSelectConversation={handleSelectConversation}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
      <div
        className={`${styles.chatRoom} ${
          !selectedConversation && isMobileView ? styles.hideRoom : ""
        }`}
      >
        {buyerId && sellerId ? (
          <ChatRoom
            sellerId={sellerId}
            buyerId={buyerId}
            messages={messages}
            setMessages={setMessages}
            handleBackToChatList={handleBackToChatList}
            selectedConversation={selectedConversation}
          />
        ) : (
          <button className={styles.startChatButton}>
            Click On A Chat To Start
          </button>
        )}
      </div>
    </div>
  );
};

export default Chat;
