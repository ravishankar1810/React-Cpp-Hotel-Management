import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-grid">
        
        {/* Col 1 */}
        <div className="footer-col">
          <h4>Why PiyuNima</h4>
          <a href="#">History & Heritage</a>
          <a href="#">Sustainability</a>
          <a href="#">Careers</a>
        </div>

        {/* Col 2 */}
        <div className="footer-col">
          <h4>Resources</h4>
          <a href="#">Showrooms</a>
          <a href="#">Catalogs</a>
          <a href="#">Warranty</a>
        </div>

        {/* Col 3 */}
        <div className="footer-col">
          <h4>Contact</h4>
          <p>Customer Support</p>
          <p>concierge@piyunima.com</p>
          <div className="social-icons">
             <span>FB</span> <span>IG</span> <span>YT</span>
          </div>
        </div>

        {/* Col 4: Newsletter (Green Box Style) */}
        <div className="footer-col newsletter-wrapper">
          <h4>Stay Inspired with PiyuNima</h4>
          <p>Join our newsletter for exclusive outdoor living tips.</p>
          <div className="footer-input-row">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      <div className="footer-bottom-row">
        <small>© 2026 PiyuNima Hospitality. All Rights Reserved.</small>
        {/* Big Watermark Logo on Right */}
        <div className="footer-big-logo">PiyuNima</div>
      </div>
    </footer>
  );
}