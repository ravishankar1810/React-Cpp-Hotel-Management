import React, { useEffect, useState } from 'react';

export default function HeroSection() {
  const [offset, setOffset] = useState(0);

  // Parallax Logic: Track scroll position
  useEffect(() => {
    const handleScroll = () => setOffset(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="hero-container">
      {/* Background Image Layer */}
      <div 
        className="hero-image"
        style={{
          // Zoom effect: 100% size + (scroll amount * small factor)
          transform: `scale(${1 + offset * 0.0005}) translateY(${offset * 0.1}px)`,
          backgroundImage: "url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')"
        }}
      ></div>

      {/* Dark Overlay Layer (for text readability) */}
      <div className="hero-overlay"></div>

      {/* Text Content Layer */}
      <div className="hero-content" style={{ transform: `translateY(${offset * -0.2}px)` }}>
        <h2 className="hero-subtitle">Welcome to Paradise</h2>
        <h1 className="hero-title">PiyuNima Hotel</h1>
        <p className="hero-desc">Experience luxury defined by elegance and comfort.</p>
        <button className="hero-btn" onClick={() => window.scrollTo({top: 800, behavior: 'smooth'})}>
          Explore Rooms
        </button>
      </div>
    </div>
  );
}