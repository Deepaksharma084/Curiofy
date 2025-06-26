import { useState, useEffect } from "react";

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
        <div className="flex justify-center items-center text-md p-2">
            <span className="text-white text-center">
                <span
                    className="font-bold w-16 inline-block text-transparent"
                    style={{
                        WebkitTextStroke: '0.01rem #ec9068',
                        color: 'white',
                        textShadow: '0 0 5px #ec9068, 0 0 10px #ec9068, 0 0 15px #ec9068'
                    }}
                >
                    {words[index]}
                </span>
                <span>with us. Dive into a universe of knowledge and creativity.</span>
            </span>
        </div>
    );
};
