import React from 'react';

const Messages = ({ messages }) => {
    return (
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            {messages && messages.length > 0 ? (
                messages.map((message, index) => (
                    <div
                        key={index}
                        className={`mb-4 ${message.fromSelf ? "text-right" : "text-left"}`}
                    >
                        <div
                            className={`inline-block p-3 rounded-xl font-bold ${message.fromSelf ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                                }`}
                        >
                            {message.message}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-500">No messages yet</p>
            )}
        </div>
    );
};

export default Messages;
