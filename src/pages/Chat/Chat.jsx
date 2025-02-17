import React, { useState, useEffect } from "react";
import ChatList from "../../components/ChatList/ChatList";
import ChatRoom from "../../components/ChatRoom/ChatRoom";
import styles from "./Chat.module.css";
import { useLocation } from "react-router-dom";
import { useAuthContext } from "../../contexts/AuthContext";

const Chat = () => {
  const location = useLocation();
  const [selectedConversation, setSelectedConversation] = useState();
  console.log(location.state);
  const [buyerId, setBuyerId] = useState(location.state?.buyerId);
  const [sellerId, setSellerId] = useState(location.state?.sellerId);
  const { user_id } = useAuthContext().userState;
  const [messages, setMessages] = useState([]);

  const handleSelectConversation = (conversation) => {
    console.log(conversation);
    setSelectedConversation((selectedConversation) => conversation);
  };
  useEffect(() => {
    if (selectedConversation) {
      setBuyerId(
        selectedConversation.role == "buyer"
          ? selectedConversation.user_id
          : selectedConversation.other_user_id
      );
      setSellerId(
        selectedConversation.role == "seller"
          ? selectedConversation.user_id
          : selectedConversation.other_user_id
      );
    } else {
      setBuyerId(null);
      setSellerId(null);
    }
  }, [selectedConversation]);

  return (
    <div className={styles.chatPage}>
      <div className={styles.chatList}>
        <ChatList
          onSelectConversation={handleSelectConversation}
          messages={messages}
          setMessages={setMessages}
        />
      </div>
      <div className={styles.chatRoom}>
        {buyerId && sellerId ? (
          <ChatRoom
            sellerId={sellerId}
            buyerId={buyerId}
            messages={messages}
            setMessages={setMessages}
          />
        ) : (
          <button className={styles.chatButton}>
            Click On A Chat To Start
          </button>
        )}
      </div>
    </div>
  );
};

export default Chat;
