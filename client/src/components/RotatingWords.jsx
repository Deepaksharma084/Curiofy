import { useState, useEffect } from "react";
import WordIndexButton from "./WordIndexButton";

export default function RotatingWords() {
    const words = ["Explore", "Learn", "Grow"];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(prev => (prev + 1) % words.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="text-zinc-200 flex justify-center items-center text-md p-2 text-center relative">
            <span className="relative text-[#ff8a4b] inline-flex justify-center w-24 py-1 px-10 rounded-full text-center z-0">
                <WordIndexButton className="font-bold" word={words[index]} />
            </span>
            <span className="ml-3 z-10">with us. Dive into a universe of knowledge and creativity.</span>
        </div>
    );
};
