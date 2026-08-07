import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaXTwitter, FaInstagram } from "react-icons/fa6";
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer id="contact" className={`${styles.footerContainer}`}>
            <div className={`${styles.footerOverlay} w-full flex flex-col justify-center items-center`}>
                <div className="parent1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
                    <div className="child1 flex flex-col p-8 items-center h-56 ">
                        <div className="text-zinc-300 text-2xl font-bold">
                            Curiofy
                        </div>
                        <p className="text-zinc-400 mt-2">Curiofy is a blog where curiosity meets creativity ,explore intriguing ideas, unique perspectives, and inspiring stories across tech, life, culture, innovation, art, and beyond.
                        </p>
                    </div>
                    <div className="child2 flex flex-col p-8 items-center h-56 ">
                        <h1 className="text-2xl font-bold text-zinc-300">Contacts</h1>
                        <p className="text-zinc-400 mt-2">deepaksharma07.dev@gmail.com</p>
                        <p className="text-zinc-400 mt-4">Jeedimetla, HYD 500055</p>
                        <p className="text-zinc-400 mt-1">+91 11-12-13-isse-agey-nahi-dera</p>
                    </div>
                    <div className="child3 flex flex-col p-8 items-center h-56 ">
                        <h1 className="text-2xl font-bold text-zinc-300">Connect</h1>
                        <div className='flex gap-4 mt-4'>
                            <Link
                                to="https://www.linkedin.com/in/deepak-sharma-d440/"
                                target="_blank"
                            >
                                <FaLinkedin className="h-10 w-10 text-white" />
                            </Link>

                            <Link
                                to="https://github.com/Deepaksharma084"
                                target="_blank"
                            >
                                <FaGithub className="h-10 w-10 text-white" />
                            </Link>

                            <Link
                                to="https://x.com/Deepak_shar_ma"
                                target="_blank"
                            >
                                <FaXTwitter className="h-10 w-10 text-white" />
                            </Link>
                            <Link
                                to="https://www.instagram.com/deepak_sharma.dev/"
                                target="_blank"
                            >
                                <FaInstagram className="h-10 w-10 text-white" />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="parent2 relative w-full flex justify-center px-8 items-center">
                    <div className="child1 bg-zinc-600 h-1 w-full"></div>
                </div>

                <div className="parent3 relative w-full flex justify-center ">
                    <div className="child1 flex items-center h-16 w-full">
                        <p className='text-zinc-400 text-sm absolute right-8'>© 2025 Curiofy. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}