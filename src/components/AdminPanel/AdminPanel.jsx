import React from 'react';
export default function AdminPanel({ currentUser }) { 
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dobrodošao {currentUser}!</h1>
      <ul>
        <li>📊 Pregled statistike</li>
        <li>📝 Upravljanje sadržajem</li>
        <li>⚙️ Podešavanja</li>
      </ul>
    </div>
  );
}