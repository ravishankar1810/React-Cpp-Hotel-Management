import React, { useEffect, useState, useRef } from 'react';

export default function ExpandingImage() {
  const [scale, setScale] = useState(0.85); // Start smaller (85% width)
  const [radius, setRadius] = useState(40); // Start with rounded corners
  const imgRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!imgRef.current) return;
      
      const rect = imgRef.current.getBoundingClientRect();
      const screenHeight = window.innerHeight;
      
      // Calculate how visible the image is (0 to 1)
      // When top of image hits center of screen, start expanding
      const distance = rect.top - screenHeight;
      
      // Logic: As it comes into view, expand width to 100% and radius to 0
      if (distance < 0 && distance > -screenHeight) {
        const progress = Math.abs(distance) / screenHeight; // 0 to 1
        // Scale from 0.85 to 1.0
        const newScale = Math.min(1, 0.85 + (progress * 0.15));
        // Radius from 40px to 0px
        const newRadius = Math.max(0, 40 - (progress * 80));
        
        setScale(newScale);
        setRadius(newRadius);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="expanding-container" ref={imgRef}>
      <div 
        className="expanding-image"
        style={{
          width: `${scale * 100}%`,
          borderRadius: `${radius}px`,
          backgroundImage: "url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')" // Fresh Outdoor Image
        }}
      >
        <div className="image-caption">
          <h3>Nature & Comfort</h3>
        </div>
      </div>
    </div>
  );
}