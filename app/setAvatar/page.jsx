"use client";
import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useRouter } from "next/navigation";
import { setAvatarRoute } from "../utils/APIroutes";

const Avatar = () => {
    const [avatars, setAvatars] = useState([]);
    const [selectedAvatar, setSelectedAvatar] = useState(null);
    const [loading, setLoading] = useState(true);
    const api = "https://api.multiavatar.com";
    const router = useRouter();

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
    };

    useEffect(() => {
        if (!localStorage.getItem("chat-app-user")) {
            router.push("/Login")
        }
    }, [])

    const setProfilePicture = async () => {
        if (selectedAvatar === null) {
            toast.error("Please select an avatar", toastOptions);
        } else {
            const user = JSON.parse(localStorage.getItem("chat-app-user"));
            try {
                const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
                    image: avatars[selectedAvatar],
                });
                if (data.isSet) {
                    user.isAvatarImageSet = true;
                    user.avatarImage = data.image;
                    localStorage.setItem("chat-app-user", JSON.stringify(user));
                    router.push("/");
                } else {
                    toast.error("Error setting avatar, please try again", toastOptions);
                }
            } catch (error) {
                toast.error("Error setting avatar, please try again", toastOptions);
            }
        }
    };



    useEffect(() => {
        const fetchAvatars = async () => {
            const avatarData = [];
            for (let i = 0; i < 4; i++) {
                const { data } = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
                avatarData.push(Buffer.from(data).toString("base64"));
            }
            setAvatars(avatarData);
            setLoading(false);
        };

        fetchAvatars();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-black">
            <h1 className="text-3xl font-bold ">Pick Your Avatar</h1>
            {loading ? (
                <div className="text-xl">Loading avatars...</div>
            ) : (
                <div className="flex flex-wrap my-10 gap-x-4">
                    {avatars.map((avatarUrl, index) => (
                        <div
                            key={index}
                            className={`p-2 border-2 rounded-lg cursor-pointer ${selectedAvatar === index ? "border-blue-500" : "border-gray-300"
                                }`}
                            onClick={() => setSelectedAvatar(index)}
                        >
                            <img
                                src={`data:image/svg+xml;base64,${avatarUrl}`}
                                alt={`Avatar ${index}`}
                                className="w-24 h-24 rounded-full"
                            />
                        </div>
                    ))}
                </div>
            )}
            {!loading && (
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    onClick={setProfilePicture}
                >
                    Confirm Selection
                </button>
            )}
            <ToastContainer />
        </div>
    );
};

export default Avatar;
