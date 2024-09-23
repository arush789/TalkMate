"use client";
import React, { useEffect, useRef, useState } from 'react';
import Logout from './Logout';
import ChatInput from './ChatInput';
import axios from 'axios';
import { getAllMessageRoute, sendMessageRoute } from '../utils/APIroutes';
import { LazyLoadImage } from 'react-lazy-load-image-component';

const ChatContainer = ({ currentChat, currentUser, socket, image, setImage, imageOpen, setImageOpen, selectedImage, setSelectedImage }) => {
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

    const handleImageOpen = (image) => {
        setImageOpen(true)
        setSelectedImage(image)
    }

    useEffect(() => {
        if (socket.current) {
            socket.current.on("msg-recieve", (data) => {
                console.log(data)
                setArrivalMessage({ fromSelf: false, message: data.message, image: data.image });
            });
        }
    }, [socket]);

    useEffect(() => {
        arrivalMessage && setMessages((prev) => [...prev, arrivalMessage])
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

            {/* Header */}
            <div className="p-4 bg-gray-200 border-b rounded-tr-3xl flex items-center justify-between">
                <div className='flex gap-x-2 items-center'>
                    <img
                        src={`data:image/svg+xml;base64,${currentChat.avatarImage}`}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <h1 className='text-black font-bold'>{currentChat.username}</h1>
                </div>
                <Logout />
            </div>

            {!imageOpen
                ? (
                    <>
                        <div className="flex-1 p-4 bg-gray-50 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-300">
                            {loading ? (
                                <div className="flex justify-center items-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : messages && messages.length > 0 ? (
                                messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`mb-4 ${message.fromSelf ? "text-right" : "text-left"}`}
                                    >
                                        <div
                                            className={`inline-block max-w-72 p-3 rounded-xl font-bold break-words ${message.fromSelf
                                                ? "bg-blue-500 text-white text-left"
                                                : "bg-gray-300 text-black text-left"
                                                }`}
                                        >
                                            {message.image && (
                                                <div className="mb-2 flex justify-center" onClick={() => handleImageOpen(message.image)} >
                                                    <LazyLoadImage
                                                        src={message.image}
                                                        alt="message-img"
                                                        className="w-52 h-52 object-cover rounded-md"
                                                    />
                                                </div>
                                            )}
                                            {message.message}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-gray-500">No messages yet</p>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </>
                )
                :
                (
                    <>
                        <div className='w-full h-full flex items-center justify-center bg-gray-500 relative'>
                            <div className='absolute top-4 right-4 bg-white rounded-3xl p-2'>
                                <button onClick={() => {
                                    setImageOpen(!imageOpen)
                                    setSelectedImage("")
                                }}
                                    className='text-blue-500 font-bold'>
                                    Close
                                </button>
                            </div>
                            <div>
                                <LazyLoadImage
                                    src={selectedImage}
                                    alt="message-img"
                                    className="h-[520px] w-[560px] object-cover rounded-xl"
                                />
                            </div>
                        </div>
                    </>
                )}
            <ChatInput handleSendMsg={handleSendMsg} image={image} setImage={setImage} />

            {/* Chat Input */}
        </div>
    );
};

export default ChatContainer;
