"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { allUsersRoute, host } from "./utils/APIroutes";
import Contacts from "./components/Contacts";
import ChatContainer from "./components/ChatContainer";
import { io } from "socket.io-client";

const Home = () => {
  const router = useRouter();
  const [contacts, setContacts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentChat, setCurrentChat] = useState(undefined);
  const [image, setImage] = useState("");
  const [messages, setMessages] = useState([
    { sender: "John", text: "Hello!" },
    { sender: "Me", text: "Hey John!" },
  ]);
  const socket = useRef();

  useEffect(() => {
    const fetchUser = async () => {
      const storedUser = localStorage.getItem("chat-app-user");
      if (!storedUser) {
        router.push("/Login");
      } else {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchContacts = async () => {
      if (currentUser && Object.keys(currentUser).length > 0) {
        console.log("Current User: ", currentUser);
        if (currentUser.isAvatarImageSet) {
          try {
            const { data } = await axios.get(
              `${allUsersRoute}/${currentUser._id}`
            );
            setContacts(data);
          } catch (error) {
            console.error("Failed to fetch contacts", error);
          }
        } else {
          router.push("/setAvatar");
        }
      }
    };

    fetchContacts();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(host);
      socket.current.emit("add-user", currentUser._id);
    }
  }, [currentUser]);

  const handleChatChange = (chat) => {
    setCurrentChat(chat);
    setImage("");
    if (socket.current) {
      socket.current.emit("set-active-chat", {
        userId: currentUser._id,
        activeChat: chat._id,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="flex h-[80vh] w-[90vw] max-w-5xl rounded-3xl shadow-2xl overflow-hidden bg-white border border-gray-300">
        {/* Left side: Contact List */}
        <Contacts
          contacts={contacts}
          currentUser={currentUser}
          chatChange={handleChatChange}
        />

        {currentChat === undefined ? (
          <div className="flex justify-center items-center w-3/4 bg-gray-100">
            <p className="text-xl font-semibold text-gray-500">
              Please select a chat to start messaging
            </p>
          </div>
        ) : (
          <>
            <ChatContainer
              messages={messages}
              currentChat={currentChat}
              currentUser={currentUser}
              socket={socket}
              image={image}
              setImage={setImage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
