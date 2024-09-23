import React, { useRef, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { RxCross1 } from 'react-icons/rx';

const Messages = ({ messages, loading, setImageOpen, imageOpen, selectedImage, setSelectedImage, messageMenu, setMessageMenu, selectedMessage, setSelectedMessage }) => {
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
        setImageOpen(true)
        setSelectedImage(image)
    }

    const handleMouseUp = () => {
        clearTimeout(holdTimer.current);
    };

    const handleDeleteMessage = () => {
        console.log("Message deleted:", selectedMessage);
        setMessageMenu(false);
    };

    const handleCloseMenu = () => {
        setMessageMenu(false);
        setSelectedMessage(null);
    };

    return (
        <>
            {!imageOpen ? (
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
                                    className={`mb-2 ${message.fromSelf ? "text-right" : "text-left"}`}
                                    onMouseDown={(event) => handleMouseDown(message.message, event)}
                                    onMouseUp={handleMouseUp}
                                >
                                    <div
                                        className={`inline-block max-w-72 p-3 rounded-3xl font-bold break-words ${message.fromSelf
                                            ? "bg-blue-500 text-white text-left"
                                            : "bg-gray-300 text-black text-left"
                                            }`}
                                    >
                                        {message.image && (
                                            <div className="mb-2 flex justify-center" onClick={() => handleImageOpen(message.image)} >
                                                <LazyLoadImage
                                                    src={message.image}
                                                    alt="message-img"
                                                    className="w-52 h-52 object-cover rounded-2xl"
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
                    </div>

                    {/* Message Menu */}
                    {messageMenu && (
                        <div
                            className='absolute transition-opacity duration-200 ease-in-out z-10'
                            style={{ top: menuPosition.top, left: menuPosition.left }}
                        >
                            <div className="bg-white border-2 shadow-lg z-10 rounded-3xl w-40 py-4 px-4">
                                <div className='p-2 bg-gray-200 hover:bg-slate-500 rounded-2xl mb-4' onClick={handleDeleteMessage}>
                                    <button className="text-red-600">
                                        Delete
                                    </button>
                                </div>
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
