import { useRouter } from 'next/navigation'
import React from 'react'
import { IoMdLogOut } from "react-icons/io";

const Logout = () => {
    const router = useRouter()

    const handleLogout = () => {
        localStorage.clear()
        router.push("/Login")
    }

    return (
        <div>
            <button className='bg-red-500 p-3 rounded-xl' onClick={handleLogout}><IoMdLogOut /></button>
        </div>
    )
}

export default Logout