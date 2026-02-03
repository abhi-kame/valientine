'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { CheckCircle, Copy, ExternalLink, Heart } from 'lucide-react';
import './success.css';

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
