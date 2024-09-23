"use client";
import { useEffect, useState } from "react";
import Logout from "./Logout";

const Contacts = ({ contacts, currentUser, chatChange }) => {
    const [currentUserName, setCurrentUserName] = useState(undefined);
    const [currentUserImage, setCurrentUserImage] = useState(undefined);
    const [currentSelected, setCurrentSelected] = useState(undefined);

    useEffect(() => {
        if (currentUser) {
            setCurrentUserImage(currentUser.avatarImage || currentUser.avatarimage);
            setCurrentUserName(currentUser.username);
        }
    }, [currentUser]);

    const changeCurrentChat = (index, contact) => {
        setCurrentSelected(index);
        chatChange(contact)
    };

    return (
        <div className="w-1/4 bg-gray-100 p-4 border-r rounded-l-3xl">
            {/* Current User Section */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-x-4">
                    {currentUserImage && (
                        <img
                            src={`data:image/svg+xml;base64,${currentUserImage}`}
                            alt="avatar"
                            className="w-12 h-12 rounded-full object-cover"
                        />
                    )}
                    <h2 className="text-md font-bold text-black">
                        {currentUserName}
                    </h2>
                </div>
                <Logout />
            </div>

            {/* Contact List */}
            <ul className="space-y-2">
                {contacts?.map((user, index) => (
                    <li
                        key={index}
                        className={`flex items-center space-x-4 p-2 cursor-pointer rounded-md hover:bg-blue-100 transition-colors ${currentSelected === index ? "bg-blue-200" : "bg-white"
                            } text-black`}
                        onClick={() => changeCurrentChat(index, user)}
                    >
                        {/* User Avatar */}

                        <img
                            src={`data:image/svg+xml;base64,${user.avatarImage}`}
                            alt="user avatar"
                            className="w-10 h-10 rounded-full object-cover"
                        />
                        {/* Username */}
                        <span>{user.username}</span>
                    </li>
                ))}
            </ul>

        </div>
    );
};

export default Contacts;
