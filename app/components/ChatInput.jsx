"use client";
import EmojiPicker from 'emoji-picker-react';
import React, { useState } from 'react';
import { storage } from '@/firebaseClient';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { MdAddPhotoAlternate } from "react-icons/md";
import { FiSend } from "react-icons/fi";

const ChatInput = ({ handleSendMsg, image, setImage }) => {
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [msg, setMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageRef, setImageRef] = useState(null);

    const handleEmojiPickerSelector = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (emojiData, event) => {
        if (emojiData && emojiData.emoji) {
            setMsg((prevMsg) => prevMsg + emojiData.emoji);
            handleEmojiPickerSelector();
        }
    };

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        setLoading(true);
        if (selectedFile) {
            const fileRef = storage.ref(`uploads/${selectedFile.name}`);
            const uploadTask = fileRef.put(selectedFile);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    console.error("Error uploading file:", error);
                    setLoading(false);
                },
                () => {
                    uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                        setImage(downloadURL);
                        setImageRef(fileRef);
                        setLoading(false);
                    });
                }
            );
        } else {
            alert("No file selected");
        }
    };

    console.log(loading)

    const handleRemoveImage = () => {
        if (imageRef) {
            imageRef.delete()
                .then(() => {
                    console.log("Image deleted successfully from Firebase");
                    setImage('');
                    setImageRef(null);
                })
                .catch((error) => {
                    console.error("Error deleting the image:", error);
                });
        } else {
            alert("No image to delete");
        }
    };

    const sendChat = (e) => {
        e.preventDefault();
        if (msg.length > 0 || image) {
            handleSendMsg(msg, image);
            setMsg('');
            setImage('');
            setImageRef(null)
        }
    };

    return (
        <>

            <div className="relative p-4 bg-transparent border-t flex items-center space-x-2">
                {(loading || image) && (
                    <div className="absolute left-0 bottom-full bg-white p-4 rounded-t-3xl border-t-2 border-r-2">
                        <div className="group relative">
                            {loading ? (
                                <div className="w-40 h-40 flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                                </div>
                            ) : (
                                <LazyLoadImage
                                    src={image}
                                    alt="selected"
                                    className="w-40 h-40 object-cover rounded-lg"
                                />
                            )}
                            {!loading && (
                                <button
                                    className="absolute top-0 left-0 w-40 h-40 bg-black bg-opacity-50 text-white hidden group-hover:flex items-center justify-center rounded-lg"
                                    onClick={handleRemoveImage}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    </div>
                )}



                {/* Text Input */}
                <form onSubmit={sendChat} className="flex-1 flex items-center bg-gray-200 p-2 rounded-3xl gap-x-3">
                    <input
                        type="text"
                        className="flex-1 p-2 bg-gray-200 text-black outline-none focus:outline-none bg-transparent"
                        placeholder="Type your message"
                        placleholderColor="black"
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                    />
                    {(msg.length > 0 || image) &&
                        < button
                            type="submit"
                            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors"
                        >
                            <FiSend />
                        </button>
                    }
                    <div className="relative">
                        {showEmojiPicker && (
                            <div className="absolute bottom-full right-0 mb-2 z-10">
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                        <button
                            type="button"
                            onClick={handleEmojiPickerSelector}
                            className="flex items-center justify-center bg-transparent p-2 rounded-full hover:bg-gray-400 transition-colors"
                        >
                            <span role="img" aria-label="emoji" className="text-xl">
                                😊
                            </span>
                        </button>
                    </div>

                    {/* File Upload Button */}
                    {!image && (
                        <div className="relative">
                            <button
                                type="button"
                                className="flex items-center justify-center bg-transparent p-2 rounded-full bg-gray-300 hover:bg-gray-400 transition-colors"
                            >
                                <input
                                    type="file"
                                    name="upload-file"
                                    onChange={handleFileUpload}
                                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                                />
                                <span role="img" aria-label="file upload" className="text-xl text-blue-600">
                                    <MdAddPhotoAlternate />
                                </span>
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </>
    );
};

export default ChatInput;
