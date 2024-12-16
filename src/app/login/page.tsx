'use client';

import { LOGIN_MUTATION } from "@/graphql/mutations";
import { useMutation } from "@apollo/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, FormEvent, useState } from "react";

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
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block mb-2">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border rounded"
                            required
                        />
                    </div>
                    {error && (
                        <div className="mb-4 text-red-500">
                            {error}
                        </div>
                    )}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    )
}

export default LoginPage