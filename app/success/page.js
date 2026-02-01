'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Copy, ExternalLink, Heart } from 'lucide-react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const [copied, setCopied] = useState(false);
    const [proposalLink, setProposalLink] = useState('');

    useEffect(() => {
        const link = searchParams.get('link');
        if (link) {
            setProposalLink(decodeURIComponent(link));
        }
    }, [searchParams]);

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(proposalLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div className="success-container">
            <div className="success-card">
                <div className="success-icon">
                    <CheckCircle size={60} color="#10b981" />
                </div>
                
                <h1>Payment Successful! 🎉</h1>
                <p className="subtitle">Your Valentine proposal is now live and ready to share!</p>

                <div className="link-section">
                    <label>Your Unique Proposal Link:</label>
                    <div className="link-box">
                        <input 
                            type="text" 
                            value={proposalLink} 
                            readOnly 
                            className="link-input"
                        />
                        <button 
                            onClick={copyToClipboard} 
                            className={`copy-btn ${copied ? 'copied' : ''}`}
                        >
                            <Copy size={18} />
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                </div>

                <div className="action-buttons">
                    <a 
                        href={proposalLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="preview-btn"
                    >
                        <ExternalLink size={18} />
                        Preview Your Proposal
                    </a>
                    
                    <Link href="/builder" className="create-another-btn">
                        <Heart size={18} />
                        Create Another
                    </Link>
                </div>

                <div className="tips">
                    <h3>💡 Tips for sharing:</h3>
                    <ul>
                        <li>Send via WhatsApp for instant delivery</li>
                        <li>Share on Instagram DMs for a surprise</li>
                        <li>You'll get an email when they click "Yes"!</li>
                    </ul>
                </div>
            </div>

            <style jsx>{`
                .success-container {
                    min-height: 100vh;
                    background: linear-gradient(135deg, #ffdde1 0%, #ee9ca7 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                    font-family: 'Quicksand', sans-serif;
                }
                .success-card {
                    background: white;
                    border-radius: 24px;
                    padding: 40px;
                    max-width: 500px;
                    width: 100%;
                    box-shadow: 0 20px 60px rgba(0,0,0,0.1);
                    text-align: center;
                }
                .success-icon {
                    margin-bottom: 20px;
                }
                h1 {
                    font-size: 1.8rem;
                    color: #333;
                    margin-bottom: 10px;
                }
                .subtitle {
                    color: #666;
                    margin-bottom: 30px;
                }
                .link-section {
                    margin-bottom: 30px;
                    text-align: left;
                }
                .link-section label {
                    font-weight: 700;
                    font-size: 0.9rem;
                    color: #555;
                    display: block;
                    margin-bottom: 10px;
                }
                .link-box {
                    display: flex;
                    gap: 10px;
                }
                .link-input {
                    flex: 1;
                    padding: 12px;
                    border: 2px solid #eee;
                    border-radius: 10px;
                    font-size: 0.85rem;
                    background: #f9f9f9;
                    color: #333;
                }
                .copy-btn {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    padding: 12px 20px;
                    background: #ff4d79;
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .copy-btn:hover {
                    background: #ff2a6d;
                }
                .copy-btn.copied {
                    background: #10b981;
                }
                .action-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    margin-bottom: 30px;
                }
                .preview-btn, .create-another-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 14px 20px;
                    border-radius: 12px;
                    font-weight: 700;
                    text-decoration: none;
                    transition: all 0.2s;
                }
                .preview-btn {
                    background: #ff4d79;
                    color: white;
                }
                .preview-btn:hover {
                    background: #ff2a6d;
                    transform: translateY(-2px);
                }
                .create-another-btn {
                    background: white;
                    color: #ff4d79;
                    border: 2px solid #ff4d79;
                }
                .create-another-btn:hover {
                    background: #fff0f3;
                }
                .tips {
                    background: #fff0f3;
                    border-radius: 12px;
                    padding: 20px;
                    text-align: left;
                }
                .tips h3 {
                    font-size: 1rem;
                    margin-bottom: 10px;
                    color: #ff4d79;
                }
                .tips ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                .tips li {
                    padding: 6px 0;
                    color: #666;
                    font-size: 0.9rem;
                }
                .tips li::before {
                    content: "✓ ";
                    color: #ff4d79;
                }

                @media (max-width: 500px) {
                    .success-card {
                        padding: 25px;
                    }
                    .link-box {
                        flex-direction: column;
                    }
                    h1 {
                        font-size: 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
