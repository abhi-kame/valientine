'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { Heart, Settings, Eye, CheckCircle, CreditCard, Upload, Loader2, Clipboard } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { uploadBase64Image } from '../../lib/storageUtils';

export default function BuilderPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        question: 'Will you be my Valentine?',
        recipientEmail: '',
        imageUrl: '/images/catflower.jpg',
        theme: 'romantic'
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [previewView, setPreviewView] = useState('ask');
    const [previewVideo, setPreviewVideo] = useState(null);
    const [noBtnPos, setNoBtnPos] = useState({ position: 'relative' });
    const [isNoRunning, setIsNoRunning] = useState(false);
    const audioRef = useRef(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    // RESET PREVIEW when form details change
    useEffect(() => {
        setPreviewView('ask');
        setPreviewVideo(null);
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
            alert("Upload failed. Make sure you have created a 'scrap_images' bucket in Supabase and set it to Public!");
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
            setPreviewVideo('/Maroon 5 - Sugar.mp4#t=42');
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

    const resetPreview = () => {
        setPreviewView('ask');
        setPreviewVideo(null);
        setNoBtnPos({ position: 'relative' });
        setIsNoRunning(false);
    };

    const handleYesPreview = () => {
        setPreviewVideo(null);
        setPreviewView('yes');
        if (audioRef.current) {
            audioRef.current.play().catch(e => console.error("Audio failed", e));
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    amount: 199, 
                    proposalId: `val-${Date.now()}`,
                    name: formData.name 
                })
            });
            
            const order = await res.json();
            if (!order.id) throw new Error("Could not create order");

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_your_id',
                amount: order.amount,
                currency: order.currency,
                name: "ValenTiny",
                description: `Proposal for ${formData.name}`,
                order_id: order.id,
                handler: function (response) {
                    const shareUrl = `${window.location.origin}/p/unique-id?name=${encodeURIComponent(formData.name)}&q=${encodeURIComponent(formData.question)}&img=${encodeURIComponent(formData.imageUrl)}&notify=${encodeURIComponent(formData.recipientEmail)}`;
                    router.push(`/success?link=${encodeURIComponent(shareUrl)}`);
                },
                prefill: {
                    email: formData.recipientEmail,
                },
                theme: {
                    color: "#ff4d79",
                },
            };

            if (!window.Razorpay) {
                alert("Razorpay is still loading. Please wait a second.");
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
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
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
                            placeholder="e.g. Suhani" 
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

                    <button type="submit" className="save-btn" disabled={isSaving}>
                        {isSaving ? 'Processing...' : 'Pay & Publish — ₹199'}
                    </button>
                    
                    <p className="form-note">🔒 Payments handled securely via Razorpay</p>
                </form>
            </div>

            <div className="preview-area">
                <div className="preview-label">
                    <Eye size={16} /> Live Preview (Mobile)
                </div>
                
                <div className="preview-frame">
                    <div className="preview-inner-content">
                        {previewVideo ? (
                            <video 
                                src={previewVideo} 
                                autoPlay 
                                loop 
                                playsInline
                                className="preview-image" 
                                style={{ height: '180px', objectFit: 'cover' }}
                            />
                        ) : (
                            <img 
                                src={previewView === 'yes' ? '/images/dance.gif' : (formData.imageUrl || '/images/catflower.jpg')} 
                                className={`preview-image ${previewView === 'yes' ? 'pulse-animation' : ''}`} 
                                alt="Preview" 
                            />
                        )}
                        
                        <h2 className="preview-hh">
                            {previewView === 'yes' ? 'Yay! ❤️' : (isNoRunning ? 'Choose Wisely! 🔫' : (formData.name || "Partner's Name"))}
                        </h2>
                        <p className="preview-pp">
                            {previewView === 'yes' ? `See you on the 14th! ❤️` : (formData.question || 'Will you be my Valentine?')}
                        </p>
                        
                        {previewView === 'ask' && (
                            <div className="preview-buttons">
                                <button 
                                    className="preview-btn no" 
                                    style={noBtnPos}
                                    onMouseEnter={isNoRunning ? moveNoButton : undefined}
                                    onClick={handleNoInteraction}
                                >
                                    No
                                </button>
                                <button 
                                    className="preview-btn yes" 
                                    onClick={handleYesPreview}
                                >
                                    Yes
                                </button>
                            </div>
                        )}

                        {previewView === 'yes' && (
                            <button className="preview-btn reset" onClick={resetPreview} style={{ marginTop: '20px' }}>
                                Reset Preview
                            </button>
                        )}
                    </div>
                </div>
                <audio ref={audioRef} src="/Minions Cheering.mp4" />
            </div>

            <style jsx>{`
                @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap');
                
                .builder-layout {
                    display: grid;
                    grid-template-columns: 420px 1fr;
                    height: 100vh;
                    font-family: 'Quicksand', sans-serif;
                    background: #fff;
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
                    background: #ff4d79;
                    color: white;
                    border: none;
                    padding: 15px;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 1.1rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    margin-top: 20px;
                }
                .form-note { font-size: 0.8rem; color: #999; text-align: center; margin-top: 10px; }
                
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
                    background: #333;
                    color: white;
                    padding: 6px 14px;
                    border-radius: 50px;
                    font-size: 0.8rem;
                    margin-bottom: 20px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .preview-frame {
                    width: 320px;
                    height: 640px;
                    background: radial-gradient(circle, #ffdde1 0%, #ee9ca7 100%);
                    border: 12px solid #333;
                    border-radius: 40px;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.1);
                    position: relative;
                    overflow: hidden;
                }
                .preview-inner-content {
                    padding: 20px;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    gap: 15px;
                }
                .preview-image {
                    width: 180px;
                    border-radius: 20px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .preview-hh {
                    font-family: 'Dancing Script', cursive;
                    font-size: 1.8rem;
                    color: #71004f;
                }
                .preview-pp {
                    font-weight: 700;
                    color: #ff2a6d;
                    font-size: 1.1rem;
                }
                .preview-buttons {
                    display: flex;
                    gap: 10px;
                    margin-top: 10px;
                }
                .preview-btn {
                    padding: 8px 20px;
                    border-radius: 50px;
                    font-weight: 700;
                    border: none;
                    font-size: 0.9rem;
                }
                .preview-btn.no {
                    background: white;
                    color: #ff4d79;
                    border: 2px solid #ff4d79;
                }
                .preview-btn.yes {
                    background: #ff4d79;
                    color: white;
                }

                @media (max-width: 900px) {
                    .builder-layout { grid-template-columns: 1fr; }
                    .preview-area { display: none; }
                }
            `}</style>
        </div>
    );
}
