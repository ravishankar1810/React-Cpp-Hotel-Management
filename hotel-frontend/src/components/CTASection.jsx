import React from 'react';

export default function CTASection() {
  return (
    <section className="cta-section">
      <div className="cta-content">
        <h2 className="cta-title">Let’s create something <br/> extraordinary together!</h2>
        <p className="cta-text">
          Partner with PiyuNima Hospitality to craft unforgettable outdoor experiences, 
          blending innovative design and enduring quality for your guests. 
          Ready to transform your space?
        </p>
        <button className="cta-btn">Start a Hospitality Project</button>
      </div>
      
      {/* Background Watermark Logo (Agio Style) */}
      <div className="cta-watermark">PiyuNima</div>
    </section>
  );
}