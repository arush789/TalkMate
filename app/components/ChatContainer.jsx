import React, { useEffect, useRef, useState } from 'react';
import ChatInput from './ChatInput';
import axios from 'axios';
import { getAllMessageRoute, sendMessageRoute } from '../utils/APIroutes';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { RxCross1 } from "react-icons/rx";
import Messages from './Messages';

const ChatContainer = ({ currentChat, currentUser, socket, image, setImage, imageOpen, setImageOpen, selectedImage, setSelectedImage, setMessageMenu, messageMenu, selectedMessage, setSelectedMessage }) => {
    const [messages, setMessages] = useState([]);
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef();

    const handleSendMsg = async (msg, image) => {
        const messageText = msg ? msg : "";
        const imageUrl = image ? image : "";

        const response = await axios.post(sendMessageRoute, {
            from: currentUser._id,
            to: currentChat._id,
            messages: messageText,
            image: imageUrl,
        });

        socket.current.emit("send-msg", {
            to: currentChat._id,
            from: currentUser._id,
            message: messageText,
            image: imageUrl
        });

        setMessages((prevMessages) => [
            ...prevMessages,
            { fromSelf: true, message: messageText, image: imageUrl },
        ]);
    };

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (data) => {
                setArrivalMessage({ fromSelf: false, message: data.message, image: data.image });
            });
        }
    }, [socket]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const response = await axios.post(getAllMessageRoute, {
                    from: currentUser._id,
                    to: currentChat._id
                });
                setMessages(response.data);
            } catch (error) {
                console.error("Error fetching messages:", error);
            } finally {
                setLoading(false);
            }
        };
        if (currentChat) {
            fetchMessages();
        }
    }, [currentChat]);

    return (
        <div className="flex flex-col w-3/4">

            <div className="p-4 bg-gray-200 border-b rounded-tr-3xl flex items-center justify-between">
                <div className='flex gap-x-2 items-center'>
                    <img
                        src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <h1 className='text-black font-bold'>{currentChat.username}</h1>
                </div>
            </div>

            <Messages
                messages={messages}
                loading={loading}
                setImageOpen={setImageOpen}
                imageOpen={imageOpen}
                setSelectedImage={setSelectedImage}
                selectedImage={selectedImage}
                messageMenu={messageMenu}
                setMessageMenu={setMessageMenu}
                selectedMessage={selectedMessage}
                setSelectedMessage={setSelectedMessage}
            />

            <ChatInput handleSendMsg={handleSendMsg} image={image} setImage={setImage} />

        </div>
    );
};

export default ChatContainer;
