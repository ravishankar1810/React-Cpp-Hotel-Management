import { useState, useEffect } from 'react';

// Component Imports
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import HeroSection from './components/HeroSection';
import PaymentModal from './components/PaymentModal';
import ChatWidget from './components/ChatWidget';
import ExpandingImage from './components/ExpandingImage';
import CTASection from './components/CTASection';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal'; // The new Login Modal

import './App.css';

function App() {

  // --- UI STATE ---
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isAIOpen, setAIOpen] = useState(false);
  
  // --- DATA STATE ---
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null); // For Payment Modal

  // --- AUTH STATE ---
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [userRole, setUserRole] = useState("guest"); // 'guest', 'admin', 'receptionist'
  const [userName, setUserName] = useState("");

  // --- 1. FETCH ROOMS ON LOAD ---
  useEffect(() => {
    fetch('http://localhost:8080/api/rooms')
      .then(res => res.json())
      .then(data => {
        if (data.rooms) setRooms(data.rooms);
      })
      .catch(err => console.error("Backend offline"));
  }, []);

  // --- 2. MENU HANDLERS ---
  const toggleMenu = () => { setMenuOpen(!isMenuOpen); if(!isMenuOpen) setAIOpen(false); };
  const toggleAI = () => { setAIOpen(!isAIOpen); if(!isAIOpen) setMenuOpen(false); };

  // --- 3. LOGIN / LOGOUT LOGIC ---
  const handleLoginSuccess = (role, name) => {
    setUserRole(role);
    setUserName(name);
    setLoginOpen(false); // Close modal
    setMenuOpen(false);  // Close menu
    alert(`Welcome back, ${name}! (${role.toUpperCase()})`);
  };

  const handleLogout = () => {
    setUserRole("guest");
    setUserName("");
    setMenuOpen(false);
    alert("Logged Out Successfully");
  };

  // --- 4. BOOKING LOGIC ---
  const handleBookClick = (room) => {
    // Optional: Force login before booking
    // if(userRole === 'guest') { setLoginOpen(true); return; }
    // setSelectedRoom(room); 
  };
  const handleClearRoom = (room) => {
  if (!confirm(`Are you sure you want to clear Room ${room.id}? This will cancel the booking.`)) return;

  fetch('http://localhost:8080/api/cancel', {
    method: 'POST',
    body: room.id.toString()
  })
  .then(res => res.json())
  .then(() => {
    alert(`Room ${room.id} is now available.`);
    window.location.reload(); // Refresh to see green status
  })
  .catch(err => alert("Error clearing room"));
};

  const handlePaymentSuccess = () => {
    fetch('http://localhost:8080/api/book', {
      method: 'POST',
      body: `${selectedRoom.id}|1` // Defaulting to 1 day for demo
    })
    .then(res => res.json())
    .then(() => {
      alert(`Booking Confirmed for Room ${selectedRoom.id}`);
      setSelectedRoom(null); 
      window.location.reload(); // Refresh to show Red status
    });
  };

  return (
    <div className="app-container">
      
      {/* --- TOP NAVIGATION --- */}
      <Navbar onToggleMenu={toggleMenu} onToggleAI={toggleAI} />

      {/* --- LEFT SIDEBAR (MENU) --- */}
      <Sidebar position="left" isOpen={isMenuOpen} title="Menu" onClose={() => setMenuOpen(false)}>
        
        {/* Profile / Status Header */}
        <div style={{marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #333'}}>
           <div style={{color: '#888', fontSize: '0.9rem', letterSpacing:'1px'}}>STATUS</div>
           <div style={{color: userRole === 'guest' ? '#fff' : '#d4af37', fontSize: '1.2rem', fontWeight: 'bold'}}>
             {userRole.toUpperCase()}
           </div>
           {userName && <div style={{color: '#666', fontSize:'0.9rem'}}>{userName}</div>}
        </div>

        {/* Navigation Links */}
        <span className="drawer-link active">Home</span>
        <span className="drawer-link">Our Rooms</span>
        
        {/* Admin/Staff Only Links */}
        {userRole !== 'guest' && (
          <>
            <span className="drawer-link" style={{color: '#d4af37'}}>Dashboard (Admin)</span>
            <span className="drawer-link">Revenue Stats</span>
            <span className="drawer-link">Settings</span>
          </>
        )}

        {/* Login/Logout Switch */}
        {userRole === 'guest' ? (
          <span className="drawer-link" onClick={() => setLoginOpen(true)}>Login</span>
        ) : (
          <span className="drawer-link" onClick={handleLogout} style={{color: '#e74c3c', marginTop: '20px'}}>Logout</span>
        )}
      </Sidebar>

      {/* --- RIGHT SIDEBAR (AI) --- */}
      <Sidebar position="right" isOpen={isAIOpen} title="AI Concierge" onClose={() => setAIOpen(false)}>
        <ChatWidget />
      </Sidebar>

      {/* --- MAIN CONTENT SCROLL AREA --- */}
      <main className={`main-content ${isMenuOpen || isAIOpen ? 'dimmed' : ''}`}>
        
        {/* A. Hero Banner (Parallax) */}
        <HeroSection />

        {/* B. Room Grid */}
        <div className="section-container">
          <h2 className="section-title">Our Accommodations</h2>
          
          <div className="room-grid">
            {rooms.length > 0 ? rooms.map(room => (
              <div key={room.id} className="luxury-card">
                <div 
                  className="card-img" 
                  style={{ backgroundImage: `url(${room.image || 'https://via.placeholder.com/400'})` }}
                ></div>
                
                <div className="card-info">
                  <span className={`status-badge ${room.booked ? 'booked' : 'available'}`}>
                  {room.booked ? 'Occupied' : 'Available'}
                  </span>
                  <h3>{room.type} Suite</h3>
                  <div className="card-price">${room.price} <span style={{fontSize:'0.8rem', color:'#999'}}>/ night</span></div>

                {/* --- BUTTON LOGIC --- */}

                  {/* CASE 1: Room is Booked AND User is Admin -> Show Clear Button */}
                  {room.booked && userRole === 'admin' ? (
                  <button 
                  className="hero-btn" 
                  onClick={() => handleClearRoom(room)}
                  style={{
                  background: '#c0392b', /* Red for Admin Action */
                  color: 'white',
                width: '100%', marginTop: '10px'
                  }}
                  >
              ⚠ Admin: Clear Room
            </button>
            ) : (
            /* CASE 2: Normal Booking Button */
            <button 
              className="hero-btn" 
              onClick={() => handleBookClick(room)} 
              disabled={room.booked} 
              style={{
               padding: '10px 20px', width: '100%', marginTop: '10px', 
               opacity: room.booked ? 0.5 : 1, cursor: room.booked ? 'not-allowed' : 'pointer'
                }}
                >
                {room.booked ? 'Occupied' : 'Book Now'}
              </button>
             )}

              </div>
              </div>
            )) : (
              <p style={{textAlign:'center', color:'#888', width:'100%'}}>Connecting to Server...</p>
            )}
          </div>
        </div>
        
        {/* C. Marketing Sections */}
        <ExpandingImage />
        <CTASection />
        
        {/* D. Footer */}
        <Footer />
      </main>

      {/* --- MODALS (Overlay Layer) --- */}
      
      {/* 1. Payment Modal */}
      {selectedRoom && (
        <PaymentModal 
          room={selectedRoom} 
          onClose={() => setSelectedRoom(null)} 
          onConfirm={handlePaymentSuccess} 
        />
      )}

      {/* 2. Login Modal */}
      <LoginModal 
        isOpen={isLoginOpen} 
        onClose={() => setLoginOpen(false)} 
        onLogin={handleLoginSuccess} 
      />

    </div>
  );
    // Add this inside function App() { ...
  
  useEffect(() => {
    // This prints a beautiful message in the browser console
    console.log(
      "%c🏨 PiyuNima Hotel v5.0\n%cBuilt by Ravi Shankar", 
      "color: #d4af37; font-size: 25px; font-family: 'Cinzel'; font-weight: bold; text-shadow: 2px 2px black;", 
      "color: #888; font-size: 14px;"
    );
  }, []);
}

export default App;