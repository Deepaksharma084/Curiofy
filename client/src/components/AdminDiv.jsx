import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';

export default function AdminDiv() {
    useEffect(() => {
        // Setting initial state
        gsap.set(".rightToLeft", {
            x: 50,
            opacity: 0
        });

        // Animate elements on the component mount
        gsap.to(".rightToLeft", {
            x: 0,
            opacity: 1,
            duration: 0.4,
            stagger: 0.2,
            ease: "power2.out"
        });
    }, []); // Empty dependency array for running once on mount

    return (
        <div className="flex z-50 flex-col">
            <p className='px-4 text-zinc-400'>For Admin only</p>
            <Link to='/owner/login' className="rightToLeft px-4 py-2 text-xl text-bold text-[#b814ff] hover:bg-[#702718]">Login</Link>
            <Link to='/owner/register' className="rightToLeft px-4 py-2 text-xl text-bold text-[#b814ff] hover:bg-[#702718]">Register</Link>
            <Link to='/blogs/create' className="rightToLeft px-4 py-2 text-xl text-bold text-[#b814ff] hover:bg-[#702718]">Create Blogs</Link>
            <Link to='/owner/updateOwner' className="rightToLeft px-4 py-2 text-xl text-bold text-[#b814ff] hover:bg-[#702718]">Change Credientials</Link>
        </div>
    );
}