import React, { useState } from 'react';

export default function PaymentModal({ room, onClose, onConfirm }) {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [error, setError] = useState('');
  const [isProcessing, setProcessing] = useState(false);

  // --- LUHN ALGORITHM (The Real Validation Logic) ---
  const validateLuhn = (num) => {
    let arr = (num + '').split('').reverse().map(x => parseInt(x));
    let lastDigit = arr.splice(0, 1)[0];
    let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0);
    sum += lastDigit;
    return sum % 10 === 0;
  };

  const handlePay = () => {
    setError('');
    
    // 1. Basic format checks
    if (!cardNumber || !expiry || !cvv) {
      setError("Please fill all fields.");
      return;
    }
    
    // 2. Remove spaces from card number
    const cleanNum = cardNumber.replace(/\s/g, '');
    
    if (cleanNum.length !== 16) {
      setError("Card must be 16 digits.");
      return;
    }

    // 3. Mathematical Check
    if (!validateLuhn(cleanNum)) {
      setError("Invalid Card Number (Luhn Check Failed).");
      return;
    }

    // 4. Simulate Processing Delay (UX)
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      onConfirm(); // Success!
    }, 2000);
  };

  return (
    <div style={styles.backdrop}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3>Secure Payment</h3>
          <button onClick={onClose} style={styles.closeBtn}>×</button>
        </div>

        <div style={styles.body}>
          <p>Booking: <strong>{room.type} Suite</strong></p>
          <h2 style={{color: '#d4af37', margin: '10px 0'}}>${room.price}.00</h2>
          
          <div style={styles.inputGroup}>
            <label>Card Number</label>
            <input 
              placeholder="0000 0000 0000 0000" 
              maxLength="19"
              value={cardNumber}
              onChange={e => setCardNumber(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={{display: 'flex', gap: '10px'}}>
            <div style={styles.inputGroup}>
              <label>Expiry</label>
              <input placeholder="MM/YY" maxLength="5" style={styles.input} value={expiry} onChange={e=>setExpiry(e.target.value)} />
            </div>
            <div style={styles.inputGroup}>
              <label>CVV</label>
              <input placeholder="123" maxLength="3" style={styles.input} value={cvv} onChange={e=>setCvv(e.target.value)} />
            </div>
          </div>

          {error && <p style={{color: 'red', fontSize: '0.9rem'}}>{error}</p>}

          <button 
            onClick={handlePay} 
            disabled={isProcessing}
            style={{...styles.payBtn, opacity: isProcessing ? 0.7 : 1}}
          >
            {isProcessing ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
        
        <div style={styles.footer}>
          <small>🔒 256-bit SSL Encrypted (Mock)</small>
        </div>
      </div>
    </div>
  );
}

// Inline Styles for the Modal (Clean & Dark)
const styles = {
  backdrop: {
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)',
    display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 300
  },
  modal: {
    background: 'white', width: '350px', borderRadius: '12px',
    boxShadow: '0 25px 50px rgba(0,0,0,0.2)', overflow: 'hidden'
  },
  header: {
    background: '#1a1a1a', color: 'white', padding: '15px 20px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center'
  },
  closeBtn: { background: 'none', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' },
  body: { padding: '20px' },
  inputGroup: { marginBottom: '15px', flex: 1 },
  input: {
    width: '100%', padding: '10px', borderRadius: '6px',
    border: '1px solid #ddd', fontSize: '1rem', marginTop: '5px', boxSizing: 'border-box'
  },
  payBtn: {
    width: '100%', padding: '12px', background: '#d4af37', color: 'white',
    border: 'none', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold',
    cursor: 'pointer', marginTop: '10px'
  },
  footer: {
    background: '#f9f9f9', padding: '10px', textAlign: 'center', color: '#888'
  }
};