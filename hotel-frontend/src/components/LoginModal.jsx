import React, { useState } from 'react';

export default function LoginModal({ isOpen, onClose, onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        body: `${username}|${password}`
      });
      const data = await res.json();

      if (data.status === "success") {
        onLogin(data.role, username);
        onClose();
      } else {
        setError("Invalid Credentials");
      }
    } catch (err) {
      setError("Server Offline");
    }
  };

  return (
    <div className="login-backdrop">
      <div className="login-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        
        <h2 className="brand-style" style={{color: '#d4af37', fontSize: '2.5rem', margin: '0 0 10px 0'}}>PiyuNima</h2>
        <p style={{color: '#aaa', marginBottom: '30px'}}>Welcome back, please login.</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              placeholder="Username" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
            />
          </div>
          <div className="input-group">
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>

          {error && <div className="error-msg">{error}</div>}

          <button type="submit" className="login-btn">Login</button>
        </form>

        <div className="login-footer">
          <span onClick={() => { onLogin("guest"); onClose(); }}>
            Continue as Guest
          </span>
        </div>
      </div>
    </div>
  );
}