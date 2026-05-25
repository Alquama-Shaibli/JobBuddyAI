import React, { useState } from 'react';
import { FiMessageCircle, FiSend, FiX } from 'react-icons/fi';
import API from '../api/axios';

const AIFloatingChat = () => {

    const [open, setOpen] = useState(false);

    const [message, setMessage] = useState('');

    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            text: 'Hi 👋 How can I help you today?'
        }
    ]);

    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {

        if (!message.trim()) return;

        const userMessage = {
            role: 'user',
            text: message
        };

        setMessages((prev) => [...prev, userMessage]);

        const currentMessage = message;

        setMessage('');

        try {

            setLoading(true);

            const res = await API.post('/ai/chat', {
                message: currentMessage
            });

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: res.data.reply
                }
            ]);

        } catch (error) {

            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    text: 'Something went wrong.'
                }
            ]);

        } finally {

            setLoading(false);
        }
    };

    return (
        <>
            {/* FLOAT BUTTON */}
            <button
                onClick={() => setOpen(true)}
                className='fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-blue-600 hover:bg-blue-700 shadow-2xl flex items-center justify-center text-white transition'
            >
                <FiMessageCircle className='text-2xl' />
            </button>

            {/* CHAT WINDOW */}
            {
                open && (
                    <div className='fixed bottom-24 right-6 z-50 w-[350px] h-[500px] rounded-3xl overflow-hidden border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f172a] shadow-2xl flex flex-col'>

                        {/* HEADER */}
                        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-800 bg-blue-600 text-white'>

                            <div>
                                <h2 className='font-semibold'>
                                    JobBuddy AI
                                </h2>

                                <p className='text-xs opacity-80'>
                                    Career Assistant
                                </p>
                            </div>

                            <button
                                onClick={() => setOpen(false)}
                            >
                                <FiX className='text-xl' />
                            </button>

                        </div>

                        {/* MESSAGES */}
                        <div className='flex-1 overflow-y-auto p-4 space-y-4'>

                            {
                                messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm
                                        ${msg.role === 'user'
                                                ? 'ml-auto bg-blue-600 text-white'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                ))
                            }

                            {
                                loading && (
                                    <div className='text-sm text-gray-500'>
                                        AI is typing...
                                    </div>
                                )
                            }

                        </div>

                        {/* INPUT */}
                        <div className='p-4 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3'>

                            <input
                                type='text'
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder='Ask anything...'
                                className='flex-1 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 outline-none'
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                    }
                                }}
                            />

                            <button
                                onClick={sendMessage}
                                className='h-12 w-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center'
                            >
                                <FiSend />
                            </button>

                        </div>

                    </div>
                )
            }
        </>
    );
};

export default AIFloatingChat;