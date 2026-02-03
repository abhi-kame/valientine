'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { templates } from '../../../lib/templates';
import FloatingHearts from '../../../components/FloatingHearts';

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
    const [mounted, setMounted] = useState(false);
    
    const audioRef = useRef(null);
    const videoRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

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
                videoRef.current.muted = false;
                videoRef.current.volume = 1.0;
                videoRef.current.play().catch(e => console.error("Playback failed", e));
            }
            return; // Stay still on the first click
        }
        moveNoButton();
    };

    const moveNoButton = () => {
        let x, y;
        // Generate coordinates as percentages of viewport
        // Stay between 10% and 80% to ensure the 150px wide button stays on screen
        do {
            x = Math.random() * 80 + 10; // 10vw to 90vw
            y = Math.random() * 80 + 10; // 10vh to 90vh
        } while (Math.abs(x - 50) < 30 && Math.abs(y - 50) < 35); // Avoid central video & text area 

        setNoBtnPos({
            position: 'fixed',
            left: `${x}vw`,
            top: `${y}vh`,
            zIndex: 100,
            transform: 'translate(-50%, -50%)',
            margin: 0,
            width: '160px' // Keep width stable during dodge
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

    if (!mounted || loading) {
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

    const currentTemplate = templates.find(t => t.id === proposal.template) || templates[0];

    return (
        <div className="proposal-container" style={{ background: currentTemplate.background }}>
            <FloatingHearts count={20} />
            
            <AnimatePresence>
                <motion.div 
                    className="proposal-card"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="card-glass-overlay"></div>
                    <div className="sparkle-effects"></div>
                    
                    <motion.div 
                        className="media-container"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
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
                                zIndex: showVideo ? 2 : -1,
                                width: '100%',
                                maxWidth: '200px',
                                aspectRatio: '9/16',
                                height: showVideo ? 'auto' : '1px'
                            }}
                        />

                        {!showVideo && (
                            <motion.img 
                                key={view === 'yes' ? 'yes-gif' : 'proposal-img'}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={view === 'yes' ? '/images/dance.gif' : proposal.image_url} 
                                alt="Proposal" 
                                className={`proposal-media ${view === 'yes' ? 'pulse' : ''}`}
                                style={{
                                    width: '100%',
                                    maxWidth: '220px',
                                    maxHeight: '280px',
                                    objectFit: 'cover',
                                    borderRadius: '24px',
                                    border: '4px solid white',
                                    boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                                }}
                            />
                        )}
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="text-content"
                    >
                        <h1 className="proposal-title" style={{ color: currentTemplate.titleColor }}>
                            {view === 'yes' ? (
                                <span className="yay-text">Yay! ❤️ <Sparkles size={24} className="inline-sparkle" /></span>
                            ) : (
                                isNoRunning ? (
                                    <span className="scary-text">Choose Wisely! 🔫</span>
                                ) : (
                                    <span className="name-text">{proposal.name}</span>
                                )
                            )}
                        </h1>
                        
                        <p className="proposal-question" style={{ color: currentTemplate.questionColor }}>
                            {view === 'yes' ? "See you on the 14th! 💕" : proposal.question}
                        </p>
                    </motion.div>

                    {view === 'ask' && (
                        <motion.div 
                            className="buttons-container"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.8 }}
                        >
                            <motion.button 
                                className="btn yes-btn"
                                onClick={handleYesClick}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                style={{ 
                                    background: currentTemplate.yesBtnBg,
                                    color: currentTemplate.yesBtnColor
                                }}
                            >
                                Yes! 💕
                            </motion.button>
                            <motion.button 
                                className={`btn no-btn ${isNoRunning ? 'scary' : ''}`}
                                style={{ 
                                    ...noBtnPos,
                                    background: currentTemplate.noBtnBg,
                                    color: currentTemplate.noBtnColor,
                                    border: `2px solid ${currentTemplate.noBtnBorder}`
                                }}
                                onMouseEnter={isNoRunning ? moveNoButton : undefined}
                                onTouchStart={isNoRunning ? moveNoButton : undefined}
                                onClick={handleNoClick}
                                layout
                            >
                                No
                            </motion.button>
                        </motion.div>
                    )}
                </motion.div>
            </AnimatePresence>

            <audio ref={audioRef} src="/Minions Cheering.mp4" />

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Quicksand:wght@500;700&display=swap');
                
                .proposal-container {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    font-family: 'Quicksand', sans-serif;
                    overflow: hidden;
                    position: relative;
                }
                :global(.proposal-card) {
                    background: rgba(255, 255, 255, 0.55);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 40px;
                    padding: 50px 25px;
                    text-align: center;
                    max-width: 450px;
                    width: 90%;
                    position: relative;
                    min-height: 580px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 35px;
                    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.15);
                    z-index: 10;
                    overflow: hidden;
                }
                :global(.card-glass-overlay) {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
                    pointer-events: none;
                    z-index: -1;
                }
                .media-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    position: relative;
                }
                .proposal-media {
                    width: 100%;
                    max-width: 200px;
                    border-radius: 24px;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
                    object-fit: cover;
                    border: 4px solid white;
                }
                .proposal-media.pulse {
                    animation: pulse 1s ease-in-out infinite;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                .text-content {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }
                .proposal-title {
                    font-family: 'Dancing Script', cursive;
                    font-size: clamp(3rem, 10vw, 4rem);
                    line-height: 1.1;
                    margin: 0;
                    word-wrap: break-word;
                }
                .scary-text {
                    color: #ff0000;
                    text-shadow: 0 0 15px rgba(255,0,0,0.4);
                    font-weight: 800;
                }
                .yay-text {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                }
                .name-text {
                    letter-spacing: -1px;
                }
                .proposal-question {
                    font-size: clamp(1.2rem, 5vw, 1.6rem);
                    font-weight: 700;
                    margin: 0;
                    padding: 0 10px;
                    line-height: 1.4;
                    opacity: 0.95;
                }
                :global(.buttons-container) {
                    display: flex;
                    gap: 25px;
                    margin-top: 20px;
                    position: relative;
                    min-height: 70px;
                    width: 100%;
                    justify-content: center;
                    z-index: 20;
                }
                :global(.btn) {
                    padding: 15px 25px;
                    width: 160px;
                    height: 60px;
                    border-radius: 25px;
                    font-weight: 800;
                    font-size: 1.3rem;
                    border: none;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                    white-space: nowrap;
                    position: relative;
                    overflow: hidden;
                    text-decoration: none;
                }
                :global(.no-btn) {
                    /* Colors handled by template style prop */
                }
                :global(.no-btn.scary) {
                    background: #fffafa !important;
                    border-color: #ff0000 !important;
                    color: #ff0000 !important;
                    box-shadow: 0 0 15px rgba(255, 0, 0, 0.2) !important;
                }
                :global(.yes-btn) {
                    /* Colors handled by template style prop */
                    box-shadow: 0 15px 35px rgba(255, 77, 121, 0.35);
                }
                :global(.yes-btn:hover) {
                    transform: translateY(-5px) scale(1.05);
                    box-shadow: 0 20px 45px rgba(255, 77, 121, 0.5);
                }
                :global(.yes-btn::after) {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                    transition: 0.6s;
                }
                :global(.yes-btn:hover::after) {
                    left: 100%;
                }
                
                @media (max-width: 480px) {
                    :global(.proposal-card) {
                        padding: 40px 15px;
                        width: 92%;
                        gap: 25px;
                        min-height: auto;
                    }
                    :global(.buttons-container) {
                        flex-direction: row;
                        gap: 12px;
                        width: 100%;
                        justify-content: center;
                    }
                    :global(.btn) {
                        width: 135px;
                        height: 52px;
                        font-size: 1.05rem;
                        border-radius: 18px;
                        padding: 0;
                    }
                    .proposal-title {
                        font-size: clamp(2.5rem, 12vw, 3rem);
                    }
                    .proposal-question {
                        font-size: 1.2rem;
                    }
                }
            `}</style>
        </div>
    );
}
