'use client';

import { useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AffiliateTracker() {
  const searchParams = useSearchParams();
  const trackRef = useRef(false);

  useEffect(() => {
    const ref = searchParams.get('ref');
    
    if (ref && !trackRef.current) {
      trackRef.current = true;
      // 1. Check if we already have a referral (First-click attribution)
      const existingRef = localStorage.getItem('val_ref');
      
      if (!existingRef) {
        // 2. Save to LocalStorage for persistence
        localStorage.setItem('val_ref', ref);
        
        // 3. Set a 30-day cookie
        const expiry = new Date();
        expiry.setDate(expiry.getDate() + 30);
        document.cookie = `val_ref=${ref}; expires=${expiry.toUTCString()}; path=/; SameSite=Lax`;
        
        // 4. Log the click (Optional but recommended for analytics)
        fetch('/api/affiliate/track-click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            refCode: ref,
            userAgent: navigator.userAgent,
            path: window.location.pathname
          })
        }).catch(err => console.error('Failed to track click:', err));
      }
    }
  }, [searchParams]);

  return null;
}
