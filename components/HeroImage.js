'use client';

export default function HeroImage() {
  return (
    <img 
      src="/images/hero-mockup.png" 
      alt="App Preview" 
      className="hero-img" 
      onError={(e) => e.target.style.display = 'none'} 
    />
  );
}
