import React, { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import axios from 'axios';
import { getAllMessageRoute, sendMessageRoute } from '../utils/APIroutes';
import Messages from './Messages';
import { v4 as uuidv4 } from "uuid";

const ChatContainer = ({
    currentChat,
    currentUser,
    socket,
    image,
    setImage,
    imageOpen,
    setImageOpen,
    selectedImage,
    setSelectedImage,
    setMessageMenu,
    messageMenu,
    selectedMessage,
    setSelectedMessage
}) => {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSending, setIsSending] = useState(false); // New loading state
    const scrollRef = useRef();

    const handleSendMsg = async (msg, image) => {
        setIsSending(true); // Start loading state
        const messageText = msg ? msg : "";
        const imageUrl = image ? image : "";
        const messageId = uuidv4();

        // Send the message to the server
        await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            messages: messageText,
            image: imageUrl,
            messageId
        });

        // Emit the message via socket
        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: messageText,
            image: imageUrl,
            messageId
        });

        // Immediately update local messages
        setMessages((prevMessages) => [
            ...prevMessages,
            { fromSelf: true, message: messageText, image: imageUrl, messageId },
        ]);

        setIsSending(false); // End loading state
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (data) => {
                setArrivalMessage({
                    fromSelf: false,
                    message: data.message,
                    image: data.image,
                    messageId: data.messageId,
                });
            });

            socket.current.on("msg-deleted", (data) => {
                console.log("Received delete message data:", data); // Log the incoming data

                // Ensure that data contains messageId
                if (data.messageId || data.id) {
                    setMessages((prevMessages) => {
                        const updatedMessages = prevMessages.filter((message) => {
                            return (message.id && message.id !== data.messageId) ||
                                (message.messageId && message.messageId !== data.messageId);
                        });

                        console.log("Updated Messages after deletion:", updatedMessages);
                        return updatedMessages;
                    });
                } else {
                    console.error("Message ID is missing in the delete event data:", data);
                }
            });


        }
    }, [socket]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);

    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const response = await axios.post(getAllMessageRoute, {
                from: currentUser._id,
                to: currentChat._id,
            });

            setMessages(response.data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentChat) {
            fetchMessages();
        }
    }, [currentChat]);

    return (
        <div className="flex flex-col w-3/4">
            <div className="p-4 bg-gray-800 border-b rounded-tr-3xl border-gray-500 flex items-center justify-between">
                <div className='flex gap-x-4 items-center'>
                    <img
                        src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <h1 className='text-white font-bold'>{currentChat.username}</h1>
                </div>
            </div>

            <div className="flex-1 p-4 bg-gray-800 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-300">
                <Messages
                    messages={messages}
                    setMessages={setMessages}
                    loading={loading}
                    setImageOpen={setImageOpen}
                    imageOpen={imageOpen}
                    setSelectedImage={setSelectedImage}
                    selectedImage={selectedImage}
                    messageMenu={messageMenu}
                    setMessageMenu={setMessageMenu}
                    selectedMessage={selectedMessage}
                    setSelectedMessage={setSelectedMessage}
                    fetchMessages={fetchMessages}
                    socket={socket}
                    currentChat={currentChat}
                    currentUser={currentUser}
                    scrollRef={scrollRef} // Pass the ref to Messages if needed
                />
            </div>
            <ChatInput handleSendMsg={handleSendMsg} image={image} setImage={setImage} isSending={isSending} />
        </div>
    );
};

export default ChatContainer;
