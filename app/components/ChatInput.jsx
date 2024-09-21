"use client";
import EmojiPicker from 'emoji-picker-react';
import React, { useState } from 'react';

const ChatInput = ({ handleSendMsg, image, setImage }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState('');

    const handleEmojiPickerSelector = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (emojiData, event) => {
        if (emojiData && emojiData.emoji) {
            setMsg((prevMsg) => prevMsg + emojiData.emoji);
            handleEmojiPickerSelector();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const sendChat = (e) => {
        e.preventDefault();
        if (msg.length > 0 || image) {
            handleSendMsg({ msg, image });
            setMsg('');
            setImage('');
        }
    };

    return (
        <>

            <div className="relative p-4 bg-transparent border-t flex items-center space-x-2">
                {image && (
                    <div className="absolute left-0 bottom-full bg-white p-4 rounded-t-3xl">
                        <div className="group relative">
                            <img
                                src={image}
                                alt="selected"
                                className="w-40 h-40 object-cover rounded-lg"
                            />
                            <button
                                className="absolute top-0 left-0 w-40 h-40 bg-black bg-opacity-50 text-white hidden group-hover:flex items-center justify-center rounded-lg"
                                onClick={() => setImage('')}
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                )}

                <div className="relative">
                    {showEmojiPicker && (
                        <div className="absolute bottom-full left-0 mb-2 z-10">
                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={handleEmojiPickerSelector}
                        className="flex items-center justify-center bg-transparent p-2 rounded-full hover:bg-gray-200 transition-colors"
                    >
                        <span role="img" aria-label="emoji" className="text-xl">
                            😊
                        </span>
                    </button>
                </div>

                {/* File Upload Button */}
                <div className="relative">
                    <button
                        type="button"
                        className="flex items-center justify-center bg-transparent px-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
                    >
                        <input
                            type="file"
                            name="upload-file"
                            onChange={handleFileChange}
                            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <span role="img" aria-label="file upload" className="text-xl text-blue-600">
                            +
                        </span>
                    </button>
                </div>

                {/* Text Input */}
                <form onSubmit={sendChat} className="flex-1 flex items-center">
                    <input
                        type="text"
                        className="flex-1 p-2 border-2 border-gray-300 rounded-full mr-4 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
                        placeholder="Type your message"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors"
                    >
                        Send
                    </button>
                </form>
            </div>
        </>
    );
};

export default ChatInput;
