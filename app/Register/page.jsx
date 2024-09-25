"use client";
import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { registerRoute } from '../utils/APIroutes';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
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
        const { password, confirmPassword, username, email } = formData;
        if (password !== confirmPassword) {
            toast.error("Password did not match", toastOptions);
            return false
        } else if (username.length < 3) {
            toast.error("Username should be greater than 3 characters", toastOptions);
            return false
        } else if (password.length <= 8) {
            toast.error("Password should be equal or greater then 8", toastOptions);
            return false
        } else if (email == "") {
            toast.error("Email is required", toastOptions);
            return false
        }
        return true
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(handleValidation())
        if (handleValidation()) {
            const { password, username, email } = formData;
            const { data } = await axios.post(registerRoute, {
                username,
                email,
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
                <h2 className="text-2xl font-bold mb-6 text-center text-black">Register</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Display Name"
                        name="username"
                        onChange={handleChange}
                        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full px-4 py-2 mb-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"

                    />
                    <input
                        type="password"
                        name="password"
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                        required
                    />
                    <input
                        type="password"
                        name="confirmPassword"
                        onChange={handleChange}
                        placeholder="Confirm password"
                        className="w-full px-4 py-2 mb-6 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-300"
                    >
                        Sign Up
                    </button>
                </form>
                <div className='flex justify-center'>
                    <h1 className='text-black mt-5'>
                        Already have an account, <Link href="/Login" className='text-blue-500 font-bold'>Login</Link>
                    </h1>
                </div>
            </div>
            {/* Moved ToastContainer here */}
            <ToastContainer />
        </div>
    );
};

export default Register;
