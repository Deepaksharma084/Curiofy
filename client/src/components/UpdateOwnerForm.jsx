import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from './AuthPage.module.css';
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const UpdateOwnerForm = () => {
    const { owner } = useAuth();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { setOwner } = useAuth();
    const navigate = useNavigate();

    //useEffect to redirect if owner is not present
    useEffect(() => {
        if (!owner) {
            navigate("/owner/login");
        }
    }, [owner, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/owner/updateOwner`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (res.ok && data.owner) {
                setSuccess("Updated successfully!");
                setOwner(data.owner);
                navigate("/");
            } else {
                setError(data.error || "Update failed.");
                // If error is about login, redirect after 2 seconds to login page
                if ((data.error || "").toLowerCase().includes("login")) {
                    setTimeout(() => {
                        navigate("/owner/login");
                    }, 2000);
                }
            }
        } catch (err) {
            setError("Error updating owner.");
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.overlay}>
                <div className="backdrop-blur-xl bg-white/10 p-8 rounded-3xl shadow-2xl w-96 border border-white/20">
                    <h2 className="text-2xl font-semibold text-white mb-6 text-center">Update Owner Info</h2>

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

                    <form className="space-y-8" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm text-white">New Email</label>
                            <input
                                className="w-full px-4 py-3 bg-transparent focus:ring-0 border-0 border-b border-white 
                                 text-white placeholder-white/50 focus:border-white   focus:outline-none 
                                 focus:ring-white/30 transition-all duration-300"
                                type="email"
                                name="email"
                                placeholder="Enter new email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm text-white/80">New Password</label>
                            <div className="relative">
                                <input
                                    className="w-full px-4 py-3 bg-transparent border-0 border-b border-white
                     text-white focus:border-white focus:ring-0 focus:outline-none  placeholder-white/50  focus:border-white/30
                     focus:ring-white/30 transition-all duration-300"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter new password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/80 hover:text-white
                     focus:outline-none"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                            <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            className="mt-5 w-full py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 
                                     focus:outline-none focus:ring-2 focus:ring-white/30 
                                     transition-all duration-300"
                            type="submit"
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateOwnerForm;