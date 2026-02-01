'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export default function ProposalPage() {
    const params = useParams();
    const proposalId = params.id;
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [proposal, setProposal] = useState(null);
    
    const [view, setView] = useState('ask');
    const [isNoRunning, setIsNoRunning] = useState(false);
    const [showVideo, setShowVideo] = useState(false);
    const [noBtnPos, setNoBtnPos] = useState({ position: 'relative' });
    
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        const fetchProposal = async () => {
            try {
                const res = await fetch(`/api/proposals?id=${proposalId}`);
                const data = await res.json();
                
                if (!res.ok) {
                    setError(data.error || 'Proposal not found');
                    return;
                }
                
                setProposal(data.proposal);
            } catch (err) {
                console.error('Failed to fetch proposal:', err);
                setError('Failed to load proposal');
            } finally {
                setLoading(false);
            }
        };

        if (proposalId) {
            fetchProposal();
        }
    }, [proposalId]);

    const handleNoClick = (e) => {
        e.preventDefault();
        if (!isNoRunning) {
            setIsNoRunning(true);
            setShowVideo(true);
            
            if (videoRef.current) {
                // Aggressive unmuting for audio
                videoRef.current.muted = false;
                videoRef.current.volume = 1.0;
                
                const startPlay = () => {
                    videoRef.current.play().catch(err => {
                        console.error("Playback failed, retrying...", err);
                        // Try unmuting again before retry
                        videoRef.current.muted = false;
                        videoRef.current.play();
                    });
                };

                // If playback hasn't started, try it
                startPlay();
            }
        }
        moveNoButton();
    };

    const moveNoButton = () => {
        const randomX = Math.floor(Math.random() * 200) - 100;
        const randomY = Math.floor(Math.random() * 200) - 100;
        setNoBtnPos({
            position: 'absolute',
            left: `calc(50% + ${randomX}px)`,
            top: `calc(50% + ${randomY}px)`,
            zIndex: 10,
            transform: 'translate(-50%, -50%)'
        });
    };

    const handleYesClick = async () => {
        // Stop the "Sugar" song video
        if (videoRef.current) {
            videoRef.current.pause();
        }
        
        setShowVideo(false);
        setView('yes');
        
        // Play celebration audio
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio failed", e));
        }

        // Fire confetti!
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        // Send notification email
        if (proposal?.notify_email) {
            try {
                await fetch('/api/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        to: proposal.notify_email,
                        name: proposal.name,
                        message: `${proposal.name} said YES to your Valentine proposal! 💕`
                    })
                });
            } catch (error) {
                console.error('Failed to send notification:', error);
            }
        }
    };

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'radial-gradient(circle, #ffdde1 0%, #ee9ca7 100%)'
            }}>
                <p style={{ color: '#ff4d79', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    Loading your proposal... 💕
                </p>
            </div>
        );
    }

    if (error || !proposal) {
        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                background: 'radial-gradient(circle, #ffdde1 0%, #ee9ca7 100%)',
                textAlign: 'center',
                padding: '20px'
            }}>
                <h1 style={{ color: '#71004f', marginBottom: '10px' }}>Oops! 💔</h1>
                <p style={{ color: '#ff4d79', fontWeight: 'bold' }}>
                    {error || 'This proposal link is invalid or has expired.'}
                </p>
            </div>
        );
    }

    return (
        <div className="proposal-container">
            <div className="proposal-card">
                <video 
                    ref={videoRef}
                    src="/sugar.mp4#t=42" 
                    loop 
                    playsInline
                    preload="auto"
                    className="proposal-media" 
                    style={{ 
                        position: showVideo ? 'relative' : 'absolute',
                        opacity: showVideo ? 1 : 0.01,
                        pointerEvents: showVideo ? 'auto' : 'none',
                        zIndex: showVideo ? 1 : -1,
                        width: '200px',
                        height: showVideo ? '200px' : '1px'
                    }}
                />

                {!showVideo && (
                    <img 
                        src={view === 'yes' ? '/images/dance.gif' : proposal.image_url} 
                        alt="Proposal" 
                        className={`proposal-media ${view === 'yes' ? 'pulse' : ''}`}
                    />
                )}

                <h1 className="proposal-title">
                    {view === 'yes' ? 'Yay! ❤️' : (isNoRunning ? 'Choose Wisely! 🔫' : proposal.name)}
                </h1>
                
                <p className="proposal-question">
                    {view === 'yes' ? "See you on the 14th! 💕" : proposal.question}
                </p>

                {view === 'ask' && (
                    <div className="buttons-container">
                        <button 
                            className="btn no-btn"
                            style={noBtnPos}
                            onMouseEnter={isNoRunning ? moveNoButton : undefined}
                            onTouchStart={isNoRunning ? moveNoButton : undefined}
                            onClick={handleNoClick}
                        >
                            No
                        </button>
                        <button 
                            className="btn yes-btn"
                            onClick={handleYesClick}
                        >
                            Yes! 💕
                        </button>
                    </div>
                )}


            </div>

            <audio ref={audioRef} src="/Minions Cheering.mp4" />

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                
                .proposal-container {
                    min-height: 100vh;
                    background: radial-gradient(circle, #ffdde1 0%, #ee9ca7 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    font-family: 'Quicksand', sans-serif;
                }
                .proposal-card {
                    text-align: center;
                    max-width: 400px;
                    width: 100%;
                    position: relative;
                    min-height: 500px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                }
                .proposal-media {
                    width: 200px;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 20px;
                    box-shadow: 0 15px 40px rgba(0,0,0,0.15);
                }
                .proposal-media.pulse {
                    animation: pulse 1s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .proposal-title {
                    font-family: 'Dancing Script', cursive;
                    font-size: 2.5rem;
                    color: #71004f;
                    margin: 0;
                }
                .proposal-question {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #ff2a6d;
                    margin: 0;
                }
                .buttons-container {
                    display: flex;
                    gap: 15px;
                    margin-top: 20px;
                    position: relative;
                    min-height: 60px;
                    width: 100%;
                    justify-content: center;
                }
                .btn {
                    padding: 12px 30px;
                    border-radius: 50px;
                    font-weight: 700;
                    font-size: 1.1rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .no-btn {
                    background: white;
                    color: #ff4d79;
                    border: 2px solid #ff4d79;
                }
                .yes-btn {
                    background: #ff4d79;
                    color: white;
                    box-shadow: 0 10px 30px rgba(255, 77, 121, 0.3);
                }
                .yes-btn:hover {
                    background: #ff2a6d;
                    transform: translateY(-3px);
                    box-shadow: 0 15px 40px rgba(255, 77, 121, 0.4);
                }
                .celebration {
                    margin-top: 20px;
                }
                .celebration-text {
                    background: white;
                    padding: 15px 30px;
                    border-radius: 50px;
                    font-weight: 700;
                    color: #ff4d79;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
            `}</style>
        </div>
    );
}
