'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Settings, Eye, CheckCircle, CreditCard, Upload, Loader2, Clipboard, Palette } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadBase64Image } from '../../lib/storageUtils';
import { templates } from '../../lib/templates';

export default function BuilderPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        question: 'Will you be my Valentine?',
        recipientEmail: '',
        imageUrl: '/images/catflower.jpg',
        template: 'romantic'
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [previewView, setPreviewView] = useState('ask');
    const [previewVideo, setPreviewVideo] = useState(false);
    const [noBtnPos, setNoBtnPos] = useState({ position: 'relative' });
    const [isNoRunning, setIsNoRunning] = useState(false);
    const [showMobilePreview, setShowMobilePreview] = useState(false);
    const [razorpayLoaded, setRazorpayLoaded] = useState(false);
    const audioRef = useRef(null);
    const previewVideoRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // RESET PREVIEW when form details change
    useEffect(() => {
        setPreviewView('ask');
        setPreviewVideo(false);
        setNoBtnPos({ position: 'relative' });
        setIsNoRunning(false);
    }, [formData]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileName = `${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage
                .from('scrap_images')
                .upload(fileName, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage
                .from('scrap_images')
                .getPublicUrl(fileName);

            setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
        } catch (error) {
            console.error("Upload failed", error);
            alert(`Upload failed: ${error.message || 'Unknown error'}. \n\nCheck your console for details. Common causes:\n1. Bucket 'scrap_images' doesn't exist\n2. Missing Storage Policies (RLS) in Supabase\n3. Invalid Supabase keys`);
        } finally {
            setIsUploading(false);
        }
    };

    const handlePasteImage = async () => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            let blob = null;
            
            for (const item of clipboardItems) {
                const imageType = item.types.find(type => type.startsWith('image/'));
                if (imageType) {
                    blob = await item.getType(imageType);
                    break;
                }
            }

            if (!blob) {
                alert('No image found in clipboard! Copy an image first.');
                return;
            }

            setIsUploading(true);
            
            // Convert Blob to Base64 to use our new utility
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = async () => {
                const base64data = reader.result;
                try {
                    const publicUrl = await uploadBase64Image(base64data);
                    setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
                } catch (error) {
                    console.error("Paste upload failed", error);
                    alert("Failed to upload pasted image.");
                } finally {
                    setIsUploading(false);
                }
            };

        } catch (err) {
            console.error("Clipboard access failed", err);
            alert("Could not access clipboard. Please allow clipboard permissions or use the upload button.");
        }
    };

    const presetImages = [
        { url: '/images/catflower.jpg', label: 'Cute Cat' },
        { url: '/images/dance.gif', label: 'Dancing' },
        { url: '/images/image.jpg', label: 'Romantic' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const selectImage = (url) => {
        setFormData(prev => ({ ...prev, imageUrl: url }));
    };

    const handleNoInteraction = (e) => {
        e.preventDefault();
        if (!isNoRunning) {
            setIsNoRunning(true);
            setPreviewVideo(true);
            
            if (previewVideoRef.current) {
                previewVideoRef.current.muted = false;
                previewVideoRef.current.volume = 1.0;
                previewVideoRef.current.play().catch(err => console.error("Preview video failed:", err));
            }
            return; // Don't move on the first interaction
        }
        moveNoButton();
    };

    const moveNoButton = () => {
        let x, y;
        // Stay within the percentage bounds of the 320x640 preview frame
        do {
            x = Math.random() * 70 + 15; // 15% to 85% left
            y = Math.random() * 75 + 10; // 10% to 85% top
        } while (Math.abs(x - 50) < 30 && Math.abs(y - 50) < 35);

        setNoBtnPos({
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            zIndex: 10,
            transform: 'translate(-50%, -50%)',
            margin: 0,
            width: '120px' // Enforce width when absolute
        });
    };

    const resetPreview = () => {
        setPreviewView('ask');
        setPreviewVideo(null);
        setNoBtnPos({ position: 'relative' });
        setIsNoRunning(false);
    };

    const handleYesPreview = () => {
        if (previewVideoRef.current) {
            previewVideoRef.current.pause();
        }
        setPreviewVideo(false);
        setPreviewView('yes');
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio failed", e));
        }
    };

    const saveProposal = async (paymentId) => {
        // Generate unique proposal ID
        const generateUUID = () => {
            if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        };
        const uniqueId = generateUUID();
        
        // Save proposal to Supabase
        try {
            const saveRes = await fetch('/api/proposals', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: uniqueId,
                    name: formData.name,
                    question: formData.question,
                    imageUrl: formData.imageUrl,
                    template: formData.template,
                    notifyEmail: formData.recipientEmail,
                    paymentId: paymentId,
                    refCode: localStorage.getItem('val_ref')
                })
            });
            
            const saveData = await saveRes.json();
            
            if (saveRes.ok) {
                // Only redirect if save was successful
                const shareUrl = `${window.location.origin}/p/${uniqueId}`;
                router.push(`/success?link=${encodeURIComponent(shareUrl)}`);
            } else {
                console.error('Failed to save proposal:', saveData.error);
                alert(`Error saving proposal: ${saveData.error}. Please contact support with your Payment ID: ${paymentId}`);
            }
        } catch (err) {
            console.error('Error saving proposal:', err);
            alert("Network error while saving your proposal. Please check your connection.");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // DEV BYPASS for localhost
        if (window.location.hostname === 'localhost') {
            console.log("🛠️ Dev Mode: Bypassing payment for localhost");
            await saveProposal(`dev_mock_${Date.now()}`);
            setIsSaving(false);
            return;
        }
        
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    amount: 49, 
                    proposalId: `val-${Date.now()}`,
                    name: formData.name 
                })
            });
            
            const order = await res.json();
            
            if (order.error || !order.id) {
                console.error("Order Creation Failed:", order);
                alert(`Checkout Error: ${order.error || "Failed to initialize payment. Please check your API keys."}`);
                setIsSaving(false);
                return;
            }

            const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
            if (!razorpayKey) {
                alert("Razorpay Key ID is missing! Please add NEXT_PUBLIC_RAZORPAY_KEY_ID to your Vercel Environment Variables.");
                setIsSaving(false);
                return;
            }
            console.log("Initializing Razorpay using key:", razorpayKey.substring(0, 8) + "...");
            if (razorpayKey.startsWith('rzp_live')) {
                console.warn("⚠️ USING LIVE PRODUCTION KEYS. Real money will be deducted.");
            }

            console.log("Initializing Razorpay...");
            const options = {
                key: razorpayKey,
                amount: order.amount,
                currency: order.currency,
                name: "ValenTiny",
                description: `Proposal for ${formData.name}`,
                order_id: order.id,
                handler: async function (response) {
                    await saveProposal(response.razorpay_payment_id);
                },
                prefill: {
                    email: formData.recipientEmail,
                },
                theme: {
                    color: "#ff4d79",
                },
            };

            if (!razorpayLoaded && !window.Razorpay) {
                alert("Razorpay is still loading. Please check your internet connection.");
                return;
            }
            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error("Payment failed", error);
            alert("Something went wrong with the payment gateway.");
        } finally {
            setIsSaving(false);
        }
    };



    if (!mounted) return null;

    return (
        <div className="builder-layout">
            <Script 
                src="https://checkout.razorpay.com/v1/checkout.js" 
                strategy="lazyOnload" 
                onLoad={() => setRazorpayLoaded(true)}
            />
            <div className="sidebar">
                <div className="sb-header">
                    <Heart fill="#ff4d79" color="#ff4d79" />
                    <h2>Customizer</h2>
                </div>

                <form className="sb-form" onSubmit={handleCreate}>
                    <div className="input-group">
                        <label>Partner's Name</label>
                        <input 
                            name="name" 
                            value={formData.name}
                            placeholder="e.g. Sakshi" 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className="input-group">
                        <label>Your Question</label>
                        <textarea 
                            name="question" 
                            value={formData.question}
                            onChange={handleChange}
                            rows={2}
                        />
                    </div>

                    <div className="input-group">
                        <label>Choose a Cute Image</label>
                        <div className="image-grid">
                            {presetImages.map((img) => (
                                <div 
                                    key={img.url} 
                                    className={`img-item ${formData.imageUrl === img.url ? 'active' : ''}`}
                                    onClick={() => selectImage(img.url)}
                                >
                                    <img src={img.url} alt={img.label} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="upload-label">
                            {isUploading ? <Loader2 className="spinner" size={16} /> : <Upload size={16} />}
                            {isUploading ? 'Uploading...' : 'Upload Personal Photo'}
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                                style={{ display: 'none' }}
                                disabled={isUploading}
                            />
                        </label>
                        <button 
                            type="button" 
                            onClick={handlePasteImage}
                            className="paste-btn"
                            disabled={isUploading}
                        >
                            <Clipboard size={16} /> Paste from Clipboard
                        </button>
                    </div>

                    <div className="input-group">
                        <label>Or Paste Image/GIF URL</label>
                        <input 
                            name="imageUrl" 
                            value={formData.imageUrl}
                            placeholder="https://example.com/cute.gif" 
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label><Palette size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Choose Template Style</label>
                        <div className="template-grid">
                            {templates.map((template) => (
                                <div 
                                    key={template.id}
                                    className={`template-item ${formData.template === template.id ? 'active' : ''}`}
                                    onClick={() => setFormData(prev => ({ ...prev, template: template.id }))}
                                    style={{ background: template.background }}
                                >
                                    <span className="template-emoji">{template.preview}</span>
                                    <span className="template-name">{template.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="input-group">
                        <label>Your Email (for 'Yes' notifications)</label>
                        <input 
                            name="recipientEmail" 
                            type="email" 
                            value={formData.recipientEmail}
                            placeholder="you@email.com" 
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button 
                        type="button" 
                        className="mobile-preview-trigger" 
                        onClick={() => setShowMobilePreview(true)}
                    >
                        <Eye size={18} /> Preview Proposal
                    </button>

                    <button type="submit" className="save-btn" disabled={isSaving}>
                        {isSaving ? 'Processing...' : 'Pay & Publish — ₹49'}
                    </button>
                    
                    <p className="form-note">🔒 Payments handled securely via Razorpay</p>
                </form>
            </div>

            <div className={`preview-area ${showMobilePreview ? 'mobile-open' : ''}`}>
                {showMobilePreview && (
                    <button 
                        className="close-preview" 
                        onClick={() => setShowMobilePreview(false)}
                    >
                        ✕ Close Preview
                    </button>
                )}
                <div className="preview-label">
                    <Eye size={16} /> Live Preview (Mobile)
                </div>
                
                <div className="preview-frame" style={{ background: templates.find(t => t.id === formData.template)?.background }}>
                    <div className={`proposal-card preview-mode ${previewView === 'yes' ? 'success-mode' : ''} ${isNoRunning ? 'scary-mode' : ''}`}>
                        <div className="card-glass-overlay"></div>
                        
                        <div className="media-container">
                            <video 
                                ref={previewVideoRef}
                                src="/sugar.mp4#t=42" 
                                loop 
                                playsInline
                                preload="auto"
                                className="proposal-media" 
                                style={{ 
                                    position: previewVideo ? 'relative' : 'absolute',
                                    opacity: previewVideo ? 1 : 0.01,
                                    zIndex: previewVideo ? 1 : -1,
                                    width: '100%',
                                    maxWidth: '180px',
                                    aspectRatio: '9/16',
                                    height: previewVideo ? 'auto' : '1px',
                                    objectFit: 'cover'
                                }}
                            />

                            {!previewVideo && (
                                <img 
                                    src={previewView === 'yes' ? '/images/dance.gif' : (formData.imageUrl || '/images/catflower.jpg')} 
                                    className={`proposal-media ${previewView === 'yes' ? 'pulse' : ''}`} 
                                    alt="Preview" 
                                    style={{
                                        width: '100%',
                                        maxWidth: '180px',
                                        maxHeight: '220px',
                                        objectFit: 'cover',
                                        borderRadius: '20px',
                                        border: '4px solid white',
                                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                                    }}
                                />
                            )}
                        </div>
                        
                        <div className="text-content">
                            <h2 className="proposal-title" style={{ color: templates.find(t => t.id === formData.template)?.titleColor }}>
                                {previewView === 'yes' ? 'Yay! ❤️' : (isNoRunning ? 'Choose Wisely! 🔫' : (formData.name || "Partner's Name"))}
                            </h2>
                            <p className="proposal-question" style={{ color: templates.find(t => t.id === formData.template)?.questionColor }}>
                                {previewView === 'yes' ? `See you on the 14th! ❤️` : (formData.question || 'Will you be my Valentine?')}
                            </p>
                        </div>
                        
                        {previewView === 'ask' && (
                            <div className="buttons-container">
                                <motion.button 
                                    className="btn yes-btn" 
                                    onClick={handleYesPreview}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    style={{ 
                                        background: templates.find(t => t.id === formData.template)?.yesBtnBg,
                                        color: templates.find(t => t.id === formData.template)?.yesBtnColor
                                    }}
                                >
                                    Yes! 💕
                                </motion.button>
                                <motion.button 
                                    className={`btn no-btn ${isNoRunning ? 'scary' : ''}`} 
                                    style={{ 
                                        ...noBtnPos,
                                        background: templates.find(t => t.id === formData.template)?.noBtnBg,
                                        color: templates.find(t => t.id === formData.template)?.noBtnColor,
                                        border: `2px solid ${templates.find(t => t.id === formData.template)?.noBtnBorder}`
                                    }}
                                    onMouseEnter={isNoRunning ? moveNoButton : undefined}
                                    onTouchStart={isNoRunning ? moveNoButton : undefined}
                                    onClick={handleNoInteraction}
                                    layout
                                >
                                    No
                                </motion.button>
                            </div>
                        )}

                        {previewView === 'yes' && (
                            <button className="reset-preview-btn" onClick={resetPreview}>
                                Try Again?
                            </button>
                        )}
                    </div>
                </div>
                
                {showMobilePreview && (
                    <div style={{ padding: '20px', width: '100%', maxWidth: '320px', zIndex: 1001 }}>
                        <button 
                            onClick={(e) => {
                                setShowMobilePreview(false);
                                handleCreate(e);
                            }}
                            className="save-btn"
                            style={{ width: '100%', margin: 0, boxShadow: '0 10px 30px rgba(255, 77, 121, 0.3)' }}
                        >
                            <Heart size={20} fill="white" /> Create My Proposal — ₹49
                        </button>
                    </div>
                )}

                <audio ref={audioRef} src="/Minions Cheering.mp4" />
            </div>

            <style jsx>{`
                .builder-layout {
                    display: grid;
                    grid-template-columns: 420px 1fr;
                    height: 100vh;
                    font-family: 'Outfit', 'Quicksand', sans-serif;
                    background: #fff;
                    color: #0f172a;
                }
                .sidebar {
                    background: white;
                    border-right: 1px solid #eee;
                    padding: 30px;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                }
                .image-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 10px;
                    margin-top: 5px;
                }
                .img-item {
                    aspect-ratio: 1;
                    border-radius: 8px;
                    overflow: hidden;
                    cursor: pointer;
                    border: 3px solid transparent;
                    transition: border-color 0.2s;
                }
                .img-item img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .img-item.active {
                    border-color: #ff4d79;
                }
                .template-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                    margin-top: 8px;
                }
                .template-item {
                    padding: 12px;
                    border-radius: 12px;
                    cursor: pointer;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    border: 3px solid transparent;
                    transition: all 0.2s;
                    color: white;
                    text-shadow: 0 1px 2px rgba(0,0,0,0.2);
                }
                .template-item.active {
                    border-color: #ff4d79;
                    transform: scale(1.02);
                }
                .template-emoji {
                    font-size: 1.5rem;
                }
                .template-name {
                    font-size: 0.75rem;
                    font-weight: 700;
                    text-align: center;
                }
                .upload-label {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 12px;
                    background: #fff0f3;
                    border: 2px dashed #ff4d79;
                    border-radius: 12px;
                    color: #ff4d79;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                }
                .upload-label:hover {
                    background: #ffe0e6;
                }
                .paste-btn {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 12px;
                    background: #f0f7ff;
                    border: 2px dashed #4d94ff;
                    border-radius: 12px;
                    color: #4d94ff;
                    cursor: pointer;
                    font-weight: 700;
                    font-size: 0.9rem;
                    transition: all 0.2s;
                    margin-top: 8px;
                    width: 100%;
                }
                .paste-btn:hover {
                    background: #e0f0ff;
                }
                .spinner {
                    animation: rotate 1s linear infinite;
                }
                @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .sb-header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 40px;
                }
                .sb-form {
                    display: flex;
                    flex-direction: column;
                    gap: 25px;
                }
                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                label { font-weight: 700; font-size: 0.9rem; color: #555; }
                input, textarea {
                    padding: 12px;
                    border: 2px solid #f0f0f0;
                    border-radius: 10px;
                    font-family: inherit;
                    font-size: 1rem;
                }
                input:focus, textarea:focus {
                    outline: none;
                    border-color: #ff4d79;
                }
                .save-btn {
                    background: linear-gradient(135deg, #ff4d79 0%, #f43f5e 100%);
                    color: white;
                    border: none;
                    padding: 18px;
                    border-radius: 16px;
                    font-weight: 800;
                    cursor: pointer;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    margin-top: 25px;
                    box-shadow: 0 10px 25px rgba(255, 77, 121, 0.25);
                    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .save-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 35px rgba(255, 77, 121, 0.35);
                    filter: brightness(1.05);
                }
                .save-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                    transform: none;
                }
                .form-note { font-size: 0.8rem; color: #999; text-align: center; margin-top: 10px; }
                
                .mobile-preview-trigger {
                    display: none;
                }
                
                .preview-area {
                    background: #fdfdfd;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    overflow: hidden;
                }
                .preview-label {
                    background: #ff4d79;
                    color: white;
                    padding: 8px 16px;
                    border-radius: 50px;
                    font-size: 0.85rem;
                    margin-bottom: 25px;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    box-shadow: 0 4px 12px rgba(255, 77, 121, 0.2);
                    font-weight: 700;
                }
                :global(.preview-frame) {
                    width: 320px;
                    height: 640px;
                    background: radial-gradient(circle, #ffdde1 0%, #ee9ca7 100%);
                    border: 10px solid #2d2d2d;
                    border-radius: 40px;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.15);
                    position: relative;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                :global(.proposal-card.preview-mode) {
                    background: rgba(255, 255, 255, 0.5);
                    backdrop-filter: blur(15px);
                    -webkit-backdrop-filter: blur(15px);
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 30px;
                    padding: 25px 15px;
                    text-align: center;
                    width: 90%;
                    max-width: 280px;
                    margin: 0 auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 15px;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                    /* Removed position: relative to allow dodge button to move freely in frame */
                }
                :global(.card-glass-overlay) {
                    position: absolute;
                    top: 0;
                    right: 0;
                    bottom: 0;
                    left: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%);
                    pointer-events: none;
                }
                .media-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    position: relative;
                }
                :global(.proposal-media) {
                    border-radius: 15px;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
                }
                :global(.proposal-card.preview-mode.success-mode) {
                    gap: 12px;
                    padding: 20px 15px;
                }
                :global(.proposal-card.preview-mode.success-mode .proposal-media) {
                    max-width: 140px;
                    max-height: 180px;
                }
                :global(.proposal-card.preview-mode.success-mode .proposal-title) {
                    font-size: 1.6rem;
                }
                :global(.proposal-card.preview-mode.success-mode .reset-preview-btn) {
                    margin-top: 8px;
                }
                :global(.proposal-card.preview-mode.scary-mode) {
                    gap: 10px;
                    padding: 15px;
                }
                :global(.proposal-card.preview-mode.scary-mode .proposal-media) {
                    max-width: 140px;
                    max-height: 220px;
                }
                :global(.proposal-card.preview-mode.scary-mode .proposal-title) {
                    font-size: 1.6rem;
                }
                .text-content {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .proposal-title {
                    font-family: 'Dancing Script', cursive;
                    font-size: 1.8rem;
                    line-height: 1.2;
                    margin: 0;
                }
                .proposal-question {
                    font-weight: 700;
                    font-size: 1rem;
                    line-height: 1.4;
                }
                :global(.buttons-container) {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                    width: 100%;
                    justify-content: center;
                    min-height: 45px;
                    /* Removed position: relative to allow dodge button to reference preview-frame */
                }
                :global(.btn) {
                    width: 120px;
                    height: 44px;
                    border-radius: 15px;
                    font-weight: 800;
                    font-size: 0.9rem;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    position: relative;
                    overflow: hidden;
                }
                :global(.btn.no-btn) {
                    background: white;
                    color: #ff4d79;
                    border: 2px solid rgba(255, 77, 121, 0.2);
                }
                :global(.btn.no-btn.scary) {
                    background: #fffafa;
                    border-color: #ff0000;
                    color: #ff0000;
                    box-shadow: 0 0 15px rgba(255, 0, 0, 0.1);
                }
                :global(.btn:hover) {
                    transform: translateY(-2px);
                    filter: brightness(0.95);
                }
                .reset-preview-btn {
                    margin-top: 15px;
                    padding: 10px 20px;
                    background: rgba(0,0,0,0.05);
                    border: 1px solid rgba(0,0,0,0.1);
                    color: #666;
                    border-radius: 12px;
                    font-weight: 700;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .reset-preview-btn:hover {
                    background: rgba(0,0,0,0.1);
                    color: #333;
                }

                @media (max-width: 900px) {
                    .builder-layout { 
                        grid-template-columns: 1fr; 
                        height: auto;
                        overflow-y: visible;
                    }
                    .sidebar {
                        border-right: none;
                        border-bottom: 1px solid #eee;
                        padding: 20px;
                        height: auto;
                        overflow-y: visible;
                    }
                    .preview-area { 
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 1000;
                        background: white;
                        display: none;
                        padding: 0;
                    }
                    .preview-area.mobile-open {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }
                    .close-preview {
                        position: absolute;
                        top: 20px;
                        z-index: 1001;
                        background: #ff4d79;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 50px;
                        font-weight: 700;
                    }
                    :global(.preview-buttons) {
                        flex-direction: row;
                        gap: 10px;
                        width: 100%;
                        max-width: 280px;
                        padding: 0 10px;
                    }
                    :global(.preview-btn) {
                        flex: 1;
                        min-width: 90px;
                        max-width: 120px;
                        height: 46px;
                    }
                    .mobile-preview-trigger {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 12px;
                        padding: 16px;
                        background: #ff4d79;
                        border: none;
                        color: white;
                        border-radius: 16px;
                        font-weight: 800;
                        cursor: pointer;
                        margin: 10px 0 15px 0;
                        width: 100%;
                        font-size: 1.1rem;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        box-shadow: 0 8px 15px rgba(255, 77, 121, 0.3);
                        letter-spacing: 0.02em;
                    }
                    .mobile-preview-trigger:hover {
                        background: #ff2a6d;
                        transform: translateY(-2px);
                        box-shadow: 0 12px 25px rgba(255, 77, 121, 0.4);
                    }
                    .mobile-preview-trigger:active {
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
