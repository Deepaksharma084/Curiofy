import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const LogoutOwner = () => {
    const { setOwner } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/owner/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            const data = await res.json();
            
            if (res.ok) {
                // Clear the owner from context
                setOwner(null);
                // Clear localStorage
                localStorage.removeItem('owner');
                // Redirect to home page
                navigate('/');
                alert(data.message || "Logged out successfully!");
            } else {
                alert(data.error || "Failed to logout");
            }
        } catch (err) {
            console.error("Logout failed:", err);
            alert("Failed to logout. Please try again.");
        }
    };

    return (
        <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 text-white rounded-xl hover:bg-white/20 
                     focus:outline-none focus:ring-2 focus:ring-white/30 
                     transition-all duration-300"
        >
            Logout
        </button>
    );
};

export default LogoutOwner;
