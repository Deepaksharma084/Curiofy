import React from 'react';
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { InertiaPlugin } from 'gsap/InertiaPlugin'
import Animation from './Category.module.css';
import { useNavigate } from 'react-router-dom';

import img1 from '../assets/medias/01.png'
import img2 from '../assets/medias/02.jpg'
import img3 from '../assets/medias/03.png'
import img4 from '../assets/medias/04.png'
import img5 from '../assets/medias/05.png'
import img6 from '../assets/medias/06.png'
import img7 from '../assets/medias/07.png'
import img8 from '../assets/medias/08.png'
import img9 from '../assets/medias/09.png'
import img10 from '../assets/medias/10.png'
import img11 from '../assets/medias/11.png'
import img12 from '../assets/medias/12.png'


gsap.registerPlugin(InertiaPlugin)

//animation for the mouse movement effect and category click handling
const MWGEffect = () => {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const rootRef = useRef(null)
    let oldX = 0
    let oldY = 0
    let deltaX = 0
    let deltaY = 0

    const handleCategoryClick = async (category) => {
        try {
            navigate(`/blogs/${category}`);
        } catch (error) {
            console.error('Error navigating:', error);
        }
    };

    useEffect(() => {
        const root = rootRef.current
        const listeners = new Set()

        const handleMouseMove = (e) => {
            deltaX = e.clientX - oldX
            deltaY = e.clientY - oldY
            oldX = e.clientX
            oldY = e.clientY
        }

        root.addEventListener('mousemove', handleMouseMove)

        const mediaElements = root.querySelectorAll(`.${Animation.media}`)
        mediaElements.forEach((el) => {
            const mouseenterHandler = () => {
                const image = el.querySelector('img')
                const text = el.querySelector('span')
                const tl = gsap.timeline({
                    onComplete: () => tl.kill(),
                })

                tl.timeScale(1.2)

                tl.to(image, {
                    inertia: {
                        x: { velocity: deltaX * 8, end: 0 },
                        y: { velocity: deltaY * 8, end: 0 }
                    },
                })

                // Added text animation
                tl.to(text, {
                    y: -10,
                    opacity: 1,
                    duration: 0.3,
                    ease: 'power2.out'
                }, '<')

                tl.fromTo(
                    image,
                    { rotate: 0 },
                    {
                        duration: 0.4,
                        rotate: (Math.random() - 0.5) * 30,
                        yoyo: true,
                        repeat: 1,
                        ease: 'power1.inOut',
                    },
                    '<'
                )
            }

            el.addEventListener('mouseenter', mouseenterHandler)
            listeners.add({ element: el, handler: mouseenterHandler })
        })

        return () => {
            root.removeEventListener('mousemove', handleMouseMove)
            listeners.forEach(({ element, handler }) => {
                element.removeEventListener('mouseenter', handler)
            })
        }
    }, [])

    return (

        <section className={`${Animation.mwg_effect000}`} ref={rootRef}>
            <div className={Animation.medias}>
                <div className={Animation.media} onClick={() => handleCategoryClick("Tech and electronics")}>
                    <img src={img1} alt="" />
                    <span className={Animation.categoryText}>Tech and electronics</span>
                </div>
                <div className={Animation.media} onClick={() => handleCategoryClick("Health")}>
                    <img src={img2} alt="" />
                    <span className={Animation.categoryText}>Health</span>
                </div>
                <div className={Animation.media} onClick={() => handleCategoryClick("Travel")}>
                    <img src={img3} alt="" />
                    <span className={Animation.categoryText}>Travel</span>
                </div>
                <div className={Animation.media} onClick={() => handleCategoryClick("Food & Recipes")}>
                    <img src={img4} alt="" />
                    <span className={Animation.categoryText}>Food & Recipes</span>
                </div>
                <div className={Animation.media} onClick={() => handleCategoryClick("Growth")}>
                    <img src={img5} alt="" />
                    <span className={Animation.categoryText}>Growth</span>
                </div>
                <div className={Animation.media} onClick={() => handleCategoryClick("Finance")}>
                    <img src={img6} alt="" />
                    <span className={Animation.categoryText}>Finance</span>
                </div>
                <div className={Animation.media} onClick={() => handleCategoryClick("Learning")}>
                    <img src={img7} alt="" />
                    <span className={Animation.categoryText}>Learning</span>
                </div>
                <div className={Animation.media} onClick={() => handleCategoryClick("Gaming")}>
                    <img src={img8} alt="" />
                    <span className={Animation.categoryText}>Gaming</span>
                </div>
                <div className={Animation.media} onClick={() => handleCategoryClick("DIY & Crafts")}>
                    <img src={img9} alt="" />
                    <span className={Animation.categoryText}>DIY & Crafts</span>
                </div>
                <div className={Animation.media} onClick={() => handleCategoryClick("Photography")}>
                    <img src={img10} alt="" />
                    <span className={Animation.categoryText}>Photography</span>
                </div>
                <div className={Animation.media} onClick={() => handleCategoryClick("Music")}>
                    <img src={img11} alt="" />
                    <span className={Animation.categoryText}>Music</span>
                </div>
                <div className={Animation.media} onClick={() => handleCategoryClick("Marketing")}>
                    <img src={img12} alt="" />
                    <span className={Animation.categoryText}>Marketing</span>
                </div>
            </div>
        </section>

    )
}

export default MWGEffect