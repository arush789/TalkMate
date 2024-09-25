"use client";
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { loginRoute } from '../utils/APIroutes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const router = useRouter()

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const toastOptions = {
        position: "bottom-right",
        autoClose: 5000,
        pauseOnHover: true,
        draggable: true,
    };



    const handleValidation = () => {
        const { password, username } = formData;
        if (password === "") {
            toast.error("Username and Password is required", toastOptions);
            return false
        } else if (username.length === "") {
            toast.error("Username and Password is required", toastOptions);
            return false
        }
        return true
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (handleValidation()) {
            const { password, username } = formData;
            const { data } = await axios.post(loginRoute, {
                username,
                password
            })
            if (data.status === false) {
                toast.error(data.msg, toastOptions)
            }
            if (data.status === true) {
                localStorage.setItem('chat-app-user', JSON.stringify(data.user))
                router.push("/")
            }
        }
    };

    useEffect(() => {
        if (localStorage.getItem("chat-app-user")) {
            router.push("/")
        }
    }, [])

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-2xl w-96">
                <h2 className="text-2xl font-bold mb-6 text-center text-black">Login</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Display Name"
                        name="username"
                        onChange={handleChange}
                        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"

                        min="3"
                    />

                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"

                    />

                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Sign In
                    </button>
                </form>
                <div className='flex justify-center'>
                    <h1 className='text-black mt-5'>
                        Dont have an account, <Link href="/Register" className='text-blue-500 font-bold'>Register</Link>
                    </h1>
                </div>
            </div>
            {/* Moved ToastContainer here */}
            <ToastContainer />
        </div>
    );
};

export default Login;
