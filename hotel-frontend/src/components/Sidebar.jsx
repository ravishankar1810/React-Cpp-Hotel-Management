import React from 'react';

export default function Sidebar({ position, isOpen, title, onClose, children }) {
  // Determine class based on position
  const drawerClass = position === 'left' ? 'drawer-left' : 'drawer-right';
  const activeClass = isOpen ? 'active' : '';

  return (
    <>
      {/* 1. The Sidebar Drawer */}
      <aside className={`sidebar-drawer ${drawerClass} ${activeClass}`}>
        <div className="drawer-header" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <h3 style={{margin:0, textTransform:'uppercase', letterSpacing:'1px'}}>{title}</h3>
          
          {/* THE CLOSE BUTTON */}
          <button 
            onClick={onClose}
            style={{
              background: 'transparent', border: 'none', color: 'white', 
              fontSize: '1.5rem', cursor: 'pointer'
            }}
          >
            ×
          </button>
        </div>
        
        <div className="drawer-content">
          {children}
        </div>
      </aside>

      {/* 2. The Backdrop (Clicking outside also closes it) */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.5)', zIndex: 150
          }}
        />
      )}
    </>
  );
}