// New file: client/src/components/UpdateOwnerForm.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from './AuthPage.module.css';
import { useAuth } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

const UpdateOwnerForm = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false); // <-- Add this line
    const { setOwner } = useAuth();
    const navigate = useNavigate();

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
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-xs"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? "Hide" : "Show"}
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