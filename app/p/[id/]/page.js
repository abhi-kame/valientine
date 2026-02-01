'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import confetti from 'canvas-confetti';

function ProposalContent() {
    const searchParams = useSearchParams();
    const [userName, setUserName] = useState('');
    const [view, setView] = useState('ask');
    const [noButtonPosition, setNoButtonPosition] = useState({ position: 'relative' });
    const [isMovingNo, setIsMovingNo] = useState(false);
    const [videoSrc, setVideoSrc] = useState(null);
    const [currentImage, setCurrentImage] = useState('/images/catflower.jpg');
    const [question, setQuestion] = useState('Will you be my Valentine?');
    const [showName, setShowName] = useState(true);
    const [mounted, setMounted] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        setMounted(true);
        // GET CUSTOM DATA FROM URL (This will later come from Database)
        const name = searchParams.get('name') || '';
        const customQuestion = searchParams.get('q') || 'Will you be my Valentine?';
        const customImage = searchParams.get('img') || '/images/catflower.jpg';
        
        setUserName(name);
        setQuestion(customQuestion);
        setCurrentImage(customImage);
    }, [searchParams]);

    if (!mounted) return null;

    const handleNo = () => {
        if (!isMovingNo) {
            setCurrentImage(null);
            setVideoSrc('/Maroon 5 - Sugar.mp4#t=42');
            setQuestion('Choose wisely! ❤️');
            setShowName(false);
            setIsMovingNo(true);
        }
        moveButton();
    };

    const moveButton = () => {
        const padding = 20;
        const randomX = Math.max(padding, Math.floor(Math.random() * (window.innerWidth - 150)));
        const randomY = Math.max(padding, Math.floor(Math.random() * (window.innerHeight - 50)));

        setNoButtonPosition({
            position: 'fixed',
            left: `${randomX}px`,
            top: `${randomY}px`,
            zIndex: 999
        });
    };

    const handleYes = async () => {
        setView('yes');
        setVideoSrc(null);
        setCurrentImage('/images/dance.gif');
        setQuestion(`Yay! See you on the 14th, ${userName}! ❤️`);
        
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio failed", e));
        }

        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff4d79', '#ff2a6d', '#ffffff']
        });

        // Notify the creator
        try {
            const creatorEmail = searchParams.get('notify');
            if(creatorEmail) {
                await fetch('/api/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: userName, to: creatorEmail })
                });
            }
        } catch (error) {
            console.error("Email send failed", error);
        }
    };

    return (
        <div className="proposal-theme">
            <div className="container">
                <div className="Mainprompt">
                    {videoSrc ? (
                        <video 
                            src={videoSrc} 
                            autoPlay 
                            loop 
                            playsInline
                            className="image" 
                            style={{ objectFit: 'cover', height: '250px' }}
                        />
                    ) : (
                        currentImage && <img src={currentImage} className={`image ${view === 'yes' ? 'pulse-animation' : ''}`} alt="Cute Cat" />
                    )}
                    
                    {showName && <h1 className="hh">{userName}</h1>}
                    <p className="pp">{question}</p>
                    
                    {view === 'ask' && (
                        <div className="buttons">
                            <button 
                                id="no-button" 
                                style={noButtonPosition}
                                onMouseEnter={isMovingNo ? moveButton : undefined}
                                onClick={handleNo}
                            >
                                No
                            </button>
                            <button id="yesButton" onClick={handleYes}>
                                Yes
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <audio ref={audioRef} src="/Minions Cheering.mp4" />
        </div>
    );
}

export default function SharedProposalPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ProposalContent />
        </Suspense>
    );
}
