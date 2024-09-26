import React, { useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { RxCross1 } from 'react-icons/rx';
import axios from 'axios';
import { deleteMessageRoute } from '../utils/APIroutes';
import { motion } from 'framer-motion'; // Import motion for animations

const Messages = ({
    messages,
    setMessages,
    loading,
    setImageOpen,
    imageOpen,
    selectedImage,
    setSelectedImage,
    messageMenu,
    setMessageMenu,
    selectedMessage,
    setSelectedMessage,
    fetchMessages,
    socket,
    currentChat,
    currentUser,
    scrollRef
}) => {

    const holdTimer = useRef(null);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });

    const handleLongPress = (message, event) => {
        setSelectedMessage(message);
        const { clientY, clientX } = event;
        setMenuPosition({ top: clientY + 10, left: clientX });
        setMessageMenu(true);
    };

    const handleMouseDown = (message, event) => {
        holdTimer.current = setTimeout(() => {
            handleLongPress(message, event);
        }, 500);
    };

    const handleImageOpen = (image) => {
        setImageOpen(true);
        setSelectedImage(image);
    }

    const handleMouseUp = () => {
        clearTimeout(holdTimer.current);
    };

    const handleDeleteMessage = async () => {
        if (selectedMessage?.fromSelf) {
            try {

                const messageIdToDelete = selectedMessage?.messageId || selectedMessage?.id;
                await axios.post(deleteMessageRoute, {
                    messageId: messageIdToDelete,
                });


                setMessages((prevMessages) => {
                    const updatedMessages = prevMessages.filter((message) => {
                        return (message.id && message.id !== messageIdToDelete) ||
                            (message.messageId && message.messageId !== messageIdToDelete);
                    });

                    console.log("Updated Messages after deletion:", updatedMessages);
                    return updatedMessages;
                });

                socket.current.emit("delete-msg", {
                    to: currentChat._id,
                    from: currentUser._id,
                    messageId: messageIdToDelete,
                });
            } catch (error) {
                console.error("Error deleting message:", error);
            } finally {
                setMessageMenu(false);
            }
        }
    };


    console.log(selectedMessage)


    const handleCloseMenu = () => {
        setMessageMenu(false);
        setSelectedMessage(null);
    };

    const isEmojiOnly = (message) => {
        const emojiRegex = /(\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\u200D)+/gu;
        const cleanedMessage = message.trim();
        const matchedEmojis = cleanedMessage.match(emojiRegex);
        if (matchedEmojis) {
            const emojiString = matchedEmojis.join('');
            return emojiString === cleanedMessage;
        }
        return false;
    };

    return (
        <>
            {!imageOpen ? (
                <>
                    <div className="flex-1 p-4 bg-gray-800 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-300" >
                        {loading ? (
                            <div className="flex justify-center items-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : messages && messages.length > 0 ? (
                            messages.map((message, index) => {
                                const emojiOnly = isEmojiOnly(message.message);
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }} // Initial state
                                        animate={{ opacity: 1, y: 0 }}   // Animate to visible
                                        exit={{ opacity: 0, y: -20 }}     // Animate on exit
                                        transition={{ duration: 0.3 }}    // Animation duration
                                        className={`mb-2 ${message.fromSelf ? "text-left" : "text-right"}`}
                                        onMouseDown={(event) => handleMouseDown(message, event)}
                                        onMouseUp={handleMouseUp}
                                        ref={scrollRef}
                                    >
                                        <div
                                            className={`inline-block max-w-72 ${emojiOnly ? "text-2xl p-0 py-2" : "text-md p-3"} text-white rounded-2xl text-left break-words 
                                                    ${message.fromSelf
                                                    ? (!emojiOnly ? "bg-blue-500 " : "")
                                                    : (!emojiOnly ? "bg-slate-600 " : " ")
                                                }`
                                            }
                                        >
                                            {message.image && (
                                                <div className={`${message.message == "" ? "" : "mb-2"} flex justify-center`} onClick={() => handleImageOpen(message.image)}>
                                                    <LazyLoadImage
                                                        src={message.image}
                                                        alt="message-img"
                                                        className="w-52 h-52 object-cover rounded-2xl"
                                                    />
                                                </div>
                                            )}
                                            {message.message}
                                        </div>
                                    </motion.div>
                                );
                            })
                        ) : (
                            <p className="text-center text-gray-500">No messages yet</p>
                        )}
                    </div>

                    {/* Message Menu */}
                    {messageMenu && (
                        <div
                            className='absolute transition-opacity duration-200 ease-in-out z-10'
                            style={{ top: menuPosition.top, left: menuPosition.left }}
                        >
                            <div className="bg-white border-2 border-gray-500 shadow-lg z-10 rounded-3xl w-40 py-4 px-4">
                                {selectedMessage?.fromSelf && (
                                    <div className='p-2 bg-gray-200 hover:bg-slate-500 rounded-2xl mb-4' onClick={handleDeleteMessage}>
                                        <button className="text-red-600">
                                            Delete
                                        </button>
                                    </div>
                                )}
                                <div className='p-2 bg-gray-200 hover:bg-slate-500 rounded-2xl' onClick={handleCloseMenu}>
                                    <button className="text-blue-600">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className='w-full h-full flex items-center justify-center bg-gray-500 relative'>
                    <div className='absolute top-4 right-4 bg-white rounded-3xl p-2 items-center flex'>
                        <button
                            onClick={() => {
                                setImageOpen(!imageOpen);
                                setSelectedImage("");
                            }}
                            className='text-red-600 '
                        >
                            <RxCross1 />
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
            )}
        </>
    );
};

export default Messages;
