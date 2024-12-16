'use client';

import { LOGIN_MUTATION } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion'
import { FC, useState } from "react";

const LoginPage: FC<any> = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('testuser');
    const [password, setPassword] = useState('password123');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const [loginMutation, { loading }] = useMutation(LOGIN_MUTATION, {
        onCompleted: (data) => {
            localStorage.setItem('access_token', data.login.access_token);
            
            onLoginSuccess?.();
            router.push('/departments');
        },
        onError: (error) => {
            setError(error.message);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            await loginMutation({
                variables: {
                    username,
                    password
                }
            });
        } catch (err) {
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-white">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 rounded-2xl shadow-2xl w-96 border border-gray-100"
            >
                <motion.h2 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold mb-6 text-center text-gray-800"
                >
                    Welcome Back
                </motion.h2>
                <form onSubmit={handleSubmit}>
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mb-4"
                    >
                        <label htmlFor="username" className="block mb-2 text-gray-600">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            required
                            placeholder="Enter your username"
                        />
                    </motion.div>
                    <motion.div 
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="mb-4"
                    >
                        <label htmlFor="password" className="block mb-2 text-gray-600">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                            required
                            placeholder="Enter your password"
                        />
                    </motion.div>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-4 text-red-500 text-center"
                        >
                            {error}
                        </motion.div>
                    )}
                    <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}

export default LoginPage