import { Link } from 'react-router-dom';
import LinkedinIcon from '/linkedin.png';
import GithubIcon from '/github.png';
import TwitterIcon from '/twitter.png';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer id="contact" className={`${styles.footerContainer}`}>
            <div className={`${styles.footerOverlay} w-screen flex flex-col justify-center items-center`}>
                <div className="parent1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full">
                    <div className="child1 flex flex-col p-8 items-center h-56 ">
                        <div className="text-zinc-300 text-2xl font-bold">
                            Curiofy
                        </div>
                        <p className="text-zinc-400 mt-2">Curiofy is a blog where curiosity meets creativity ,explore intriguing ideas, unique perspectives, and inspiring stories across tech, life, culture, innovation, art, and beyond.
                        </p>
                    </div>
                    <div className="child2 flex flex-col p-8 items-center h-56 ">
                        <h1 className="text-2xl font-bold text-zinc-300">Contact Us</h1>
                        <p className="text-zinc-400 mt-2">dk3433045@gmail.com</p>
                        <p className="text-zinc-400 mt-4">Ram Reddy Nagar ,JDM, HYD 500055</p>
                        <p className="text-zinc-400 mt-1">+91 1234567890</p>
                    </div>
                    <div className="child3 flex flex-col p-8 items-center h-56 ">
                        <h1 className="text-2xl font-bold text-zinc-300">Follow Us</h1>
                        <div className='flex gap-4 mt-4'>
                            <Link to='https://www.linkedin.com/in/deepak-sharma-d440/' target="_blank"><img className='h-10 filter invert' src={LinkedinIcon} alt="" /></Link>
                            <Link to='https://github.com/Deepaksharma084' target="_blank"><img className='h-10 filter invert' src={GithubIcon} alt="" /></Link>
                            <Link to='https://x.com/Deepak_shar_ma' target="_blank"><img className='h-10 filter invert' src={TwitterIcon} alt="" /></Link>
                        </div>
                    </div>
                </div>

                <div className="parent2 relative w-screen flex justify-center px-8 items-center">
                    <div className="child1 bg-zinc-600 h-1 w-screen"></div>
                </div>

                <div className="parent3 relative w-screen flex justify-center ">
                    <div className="child1 flex items-center h-16 w-screen">
                        <p className='text-zinc-400 text-sm absolute right-8'>© 2025 Curiofy. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}