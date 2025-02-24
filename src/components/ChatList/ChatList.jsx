import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import styles from "./ChatList.module.css";

const ChatList = ({ onSelectConversation, messages, setMessages }) => {
  const [conversations, setConversations] = useState([]);
  const { user_id } = useAuthContext().userState;
  const [search, setSearch] = useState("");
  const [filteredConv, setFilteredConv] = useState([]);

  function fetchConversations() {
    fetch(`http://localhost:3001/conversation/chats?user_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        setConversations(data.conversations);
        setFilteredConv(data.conversations);
      })
      .catch((err) => console.error(err));
  }

  useEffect(() => {
    fetchConversations();
  }, [user_id, messages]);

  useEffect(() => {
    setFilteredConv(
      conversations?.filter(
        (conv) =>
          !search ||
          conv.other_user_name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, conversations]);

  return (
    <div className={styles.chatListContainer}>
      <div className={styles.searchBox}>
        <img src="/assets/sicon.png" alt="search" className={styles.icon} />
        <input
          type="text"
          value={search}
          className={styles.searchInput}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Find Your Conversations"
        />
      </div>
      <ul className={styles.conversationList}>
        {filteredConv?.map((conv) => (
          <li
            key={conv.conversation_id}
            onClick={() => {
              setSearch("");
              onSelectConversation(conv);
            }}
            className={styles.conversationItem}
          >
            <div className={styles.username}>{conv.other_user_name}</div>
            <div className={styles.messagePreview}>
              <span>{conv.lastMessage}</span>
              {conv.unread_count > 0 && (
                <span className={styles.unreadCount}>{conv.unread_count}</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
