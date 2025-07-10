import React from 'react';
import styles from './HomePage.module.css';
import MWGEffect from './Category';
import img1 from '../assets/medias/mainImage.png';
import RotatingWords from './RotatingWords';
import auroraEffect from './AuroraEffect.module.css';


export default function Home() {
    return (
        <>
            <div className={styles.authContainer}>
                <div className={styles.overlay}>
                    <div className="container mx-auto px-4 bg-transparent grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:gap-8 xl:max-w-7xl overflow-visible">

                        <div className='child1 flex gap-3 flex-row items-center max-sm:h-[calc(100vh-25rem)]  bg-transparent' style={{ position: 'relative', zIndex: 1 }}>

                            <div className='subchild1 flex justify-center items-center h-[calc(100vh-8rem)] w-1/6 bg-transparent'>
                                <div className="text-white whitespace-pre p-3 font-bold tracking-widest rotate-180 [writing-mode:vertical-rl]">
                                    <div className="inline-block h-38">
                                        BE&nbsp;&nbsp;&nbsp;THAT&nbsp;&nbsp;&nbsp;CURIOUS
                                    </div>
                                    <div className='h-10 inline-block'>
                                        <span className={styles.dotAnimation}>.</span>
                                    </div>
                                </div>
                            </div>

                            <div className='subchild2 -z-10 flex justify-center items-center h-[calc(100vh-8rem)] w-[80%] bg-transparent'>
                                <div className={styles.mainImageSwing}>
                                    <img src={img1} alt="" />
                                </div>
                            </div>
                        </div>

                        <div className='child2'>
                            <div className='subchild3 flex flex-col items-center w-full bg-transparent md:mt-10 mb-8'>
                                <div className='flex flex-col justify-center items-center bg-transparent mb-2'>
                                    <h1 className='text-white whitespace-pre font-bold text-base md:text-2xl'>WELCOME TO THE WORLD OF CURIOSITY</h1>
                                    <p className='text-zinc-400 text-sm'>
                                        <RotatingWords />
                                    </p>
                                </div>
                                <div className={`${auroraEffect.auroraBg} overflow-visible backdrop-blur-2xl md:p-8 px-3 py-4 rounded-2xl`}>
                                    <h1 className='text-white font-bold text-center mb-6 text-2xl'>Categories</h1>
                                    <MWGEffect />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}