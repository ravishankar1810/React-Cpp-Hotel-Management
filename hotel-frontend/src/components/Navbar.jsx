import React from 'react';

export default function Navbar({ onToggleMenu, onToggleAI }) {
  return (
    <nav className="navbar">
      {/* Left: Hamburger */}
      <button className="nav-icon" onClick={onToggleMenu}>
        ☰
      </button>

      {/* Center: Brand */}
      <h1 className="brand-name">PiyuNima Hotel</h1>

      {/* Right: AI Robot */}
      <button className="nav-icon" onClick={onToggleAI}>
        🤖
      </button>
    </nav>
  );
}