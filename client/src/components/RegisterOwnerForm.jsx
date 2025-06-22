import { useState } from "react";
import { Link } from "react-router-dom";
import styles from './AuthPage.module.css';

const RegisterOwner = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { email, password } = formData;
        if (!email || !password) {
            alert("Please fill all fields.");
            return;
        }

        try {
            const res = await fetch("http://localhost:3000/owner/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            
            if (res.ok) {
                alert(data.message || "Owner registered successfully!");
            } else {
                alert(data.error || "Failed to register owner.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.overlay}>
                <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl w-96 border border-white/20">
                    <h2 className="text-2xl font-semibold text-white mb-6 text-center">Register</h2>
                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm text-white">Email</label>
                            <input
                                className="w-full px-4 py-3 bg-transparent focus:ring-0 border-0 border-b border-white 
                                         text-white placeholder-white/50 focus:border-white focus:outline-none 
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
                                         text-white focus:border-white focus:ring-0 focus:outline-none placeholder-white/50 focus:border-white/30
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
                            Register
                        </button>
                    </form>
                    <div className="mt-6 flex items-center justify-center">
                        <p className="text-white/80 text-sm">
                            Already have an account?{' '}
                            <Link to="/owner/login" className="text-white hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterOwner;