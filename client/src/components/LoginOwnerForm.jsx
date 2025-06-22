import { useState } from "react";
import { Link } from "react-router-dom";
import LogoutOwner from "./LogoutOwnerButton";
import styles from './AuthPage.module.css';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const LoginOwner = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const { setOwner } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clears messages when user starts typing
        setError("");
        setSuccess("");
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/owner/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok && data.owner) {
                setSuccess("Login successful!");
                setOwner(data.owner);
                setTimeout(() => {
                    navigate('/blogs/create');
                }, 1500);
            } else {
                setError(data.error || "Invalid email or password");
            }
        } catch (error) {
            console.error('Login error:', error);
            setError("An error occurred during login");
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.overlay}>
                <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl w-96 border border-white/20">
                    <h2 className="text-2xl font-semibold text-white mb-6 text-center">Login</h2>

                    {/* Alert Messages */}
                    {error && (
                        <div className="bg-red-500/20 text-white p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-green-500/20 text-white p-3 rounded-lg mb-4 text-sm">
                            {success}
                        </div>
                    )}

                    <form className="space-y-8" onSubmit={handleLogin}>
                        <div className="space-y-2">
                            <label className="text-sm text-white">Email</label>
                            <input
                                className="w-full px-4 py-3 bg-transparent focus:ring-0 border-0 border-b border-white 
                                 text-white placeholder-white/50 focus:border-white   focus:outline-none 
                                 focus:ring-white/30 transition-all duration-300"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/80">Password</label>
                            <input
                                className="w-full px-4 py-3 bg-transparent border-0 border-b border-white
                                         text-white ocus:border-white focus:ring-0 focus:outline-none  placeholder-white/50  focus:border-white/30
                                         focus:ring-white/30 transition-all duration-300"
                                type="password"
                                name="password"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <button
                            className="mt-5 w-full py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 
                                     focus:outline-none focus:ring-2 focus:ring-white/30 
                                     transition-all duration-300"
                            type="submit"
                        >
                            Login
                        </button>
                    </form>
                    <div className="mt-8 flex p-2 text-white items-center justify-between">
                        <LogoutOwner />
                        <div className="flex items-center justify-center">
                            <p className="text-center text-white/80 text-sm">
                                Don't have an account?{' '}
                                <Link to="/owner/register" className="text-white hover:underline">
                                    Register
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginOwner;