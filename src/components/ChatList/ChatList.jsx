import React, { useEffect, useState } from "react";
import styles from "./ChatList.module.css";
import { useAuthContext } from "../../contexts/AuthContext";

const ChatList = ({ onSelectConversation }) => {
  const [conversations, setConversations] = useState([]);
  const { user_id } = useAuthContext().userState;
  const [search, setSearch] = useState("");
  const [filteredConv, setFilteredConv] = useState([]);

  useEffect(() => {
    // Fetch conversations for the user
    fetch(`http://localhost:3001/conversation/chats?user_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data.conversations);
        setConversations(data.conversations);
        setFilteredConv(data.conversations); // Initialize filtered list
      })
      .catch((err) => console.error(err));
  }, [user_id]);

  useEffect(() => {
    // Update filtered conversations based on the search input
    setFilteredConv(
      conversations?.filter(
        (conv) =>
          !search ||
          conv.other_user_name.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, conversations]); // Only rerun the effect when 'search' or 'conversations' changes

  return (
    <div className={styles.chatList}>
      <div className={styles.convSearch}>
        <div className={styles.convSearchInput}>
          <img
            src="/assets/sicon.png"
            alt="search"
            width="30px"
            height="30px"
          />
          <input
            type="text"
            value={search}
            className={styles.convSearchText}
            onChange={(e) => setSearch(e.target.value)} // Fix typo here
            placeholder="Find Your Conversations"
          />
        </div>
      </div>
      <ul className={styles.conversationList}>
        {filteredConv?.map((conv) => (
          <li
            key={conv.conversation_id}
            onClick={() => {
              setSearch(""); // Clear the search input when selecting a conversation
              onSelectConversation(conv); // Handle conversation selection
            }}
            className={styles.conversationItem}
          >
            <div className={styles.personName}>{conv.other_user_name}</div>
            <div className={styles.convDetails}>
              {conv.lastMessage}
              {conv.unread_count != 0 && (
                <div className={styles.notificationBadge}>
                  {conv.unread_count}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChatList;
