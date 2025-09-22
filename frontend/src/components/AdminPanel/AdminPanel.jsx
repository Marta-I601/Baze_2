import React, { useState, useEffect } from 'react';

export default function AdminPanel({ currentUser }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);

  // Učitaj korisnike iz baze
  useEffect(() => {
    fetch("http://localhost/Baze_2/services/users/users.php")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Greška pri učitavanju korisnika:", err));
  }, []);

  /*OVO JE ZA BRISANJE KORISNIKA */ 
  const handleDelete = (id) => {
    if (window.confirm("Da li si siguran da želiš da obrišeš korisnika?")) {
      fetch("http://localhost/Baze_2/services/users/delete_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      })
        .then(res => res.json())
        .then(data => {
          alert(data.message);
          if (data.success) {
            setUsers(prev => prev.filter(user => user.Id !== id));
          }
        })
        .catch(err => console.error("Greška:", err));
    }
  };

  /*IZMENA ROLE KORISNIKA - NEMA SMISLA DA ADMIN MENJA BILO ŠTA DRUGO */
  const handleSaveRole = (id, Rola) => {
    fetch("http://localhost/Baze_2/services/users/update_user.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, Rola })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
      })
      .catch(err => console.error("Greška:", err));
  };

  return (
    <div className="admin">
      <h1>Dobrodošao {currentUser}!</h1>

      {/* Navigacija - tabovi */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "dashboard" ? "active" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Pregled statistike
        </button>
        <button
          className={`tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          👥 Upravljanje korisnicima
        </button>
        <button
          className={`tab ${activeTab === "settings" ? "active" : ""}`}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Podešavanja
        </button>
      </div>

      {/* Sadržaj taba */}
      <div className="section">
        {activeTab === "dashboard" && (
          <div className="card">
            <h2>📊 Statistika</h2>
            <p>Ovde možeš prikazati grafikone i broj korisnika.</p>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <div className="users-header">
              <h2>👥 Lista korisnika</h2>
              <input
                type="text"
                placeholder="Pretraži po korisničkom imenu ili emailu..."
                className="search-bar"
              />
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Korisničko ime</th>
                  <th>Email</th>
                  <th>Rola</th>
                  <th>Akcije</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.Id}>
                    <td>{user.Id}</td>
                    <td>{user.Username}</td>
                    <td>{user.Email}</td>
                    <td>{parseInt(user.Rola, 10) === 0 ? "Admin" : "Korisnik"}</td>
                    <td>
                      {editingUserId === user.Id ? (
                        <>
                          <select
                            value={user.Rola}
                            onChange={(e) => {
                              const newRole = parseInt(e.target.value, 10);
                              setUsers(prev =>
                                prev.map(u => u.Id === user.Id ? { ...u, Rola: newRole } : u)
                              );
                            }}
                          >
                            <option value={0}>Admin</option>
                            <option value={1}>Korisnik</option>
                          </select>
                          <button
                            className="btn btn-success"
                            onClick={() => { handleSaveRole(user.Id, user.Rola); setEditingUserId(null); }}
                          >
                            Sačuvaj izmene
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            className="btn btn-primary"
                            onClick={() => setEditingUserId(user.Id)}
                          >
                            Izmeni
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(user.Id)}
                          >
                            Obriši
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="card">
            <h2>⚙️ Podešavanja</h2>
            <p>Ovde ide konfiguracija aplikacije.</p>
          </div>
        )}
      </div>
    </div>
  );
}