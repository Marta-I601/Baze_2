import React, { useState } from "react";
//import "./CreateFormPage.css";

const CreateFormPage = ({ currentUser, onFormCreated }) => {
  const [formData, setFormData] = useState({ naziv: "", opis: "", allowAnonymous: false });
  const [isSaving, setIsSaving] = useState(false);

  const createForm = async () => {
    if (!formData.naziv) return alert("Unesite naziv forme");
    setIsSaving(true);
    try {
      const res = await fetch("http://localhost/Baze_2/services/forms/createForm.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          naziv: formData.naziv,
          opis: formData.opis,
          allowAnonymous: formData.allowAnonymous
        })
      });
      const data = await res.json();
      if (data.success) {
        onFormCreated(data.formId, formData);
      } else {
        alert("Greška pri kreiranju forme: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Greška sa serverom");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="create-form-container">
      <h2>Kreiranje nove forme</h2>
      <div className="form-card">
        <div className="form-group">
          <label>Naziv forme</label>
          <input
            type="text"
            value={formData.naziv}
            onChange={e => setFormData({ ...formData, naziv: e.target.value })}
            placeholder="Unesite naziv forme"
          />
        </div>
        <div className="form-group">
          <label>Opis</label>
          <textarea
            value={formData.opis}
            onChange={e => setFormData({ ...formData, opis: e.target.value })}
            placeholder="Unesite opis forme"
          />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={formData.allowAnonymous}
              onChange={e => setFormData({ ...formData, allowAnonymous: e.target.checked })}
            />
            Dozvoli anonimno popunjavanje
          </label>
        </div>
        <button className="btn-primary" onClick={createForm} disabled={isSaving}>
          {isSaving ? "Čuvanje..." : "Kreiraj formu"}
        </button>
      </div>
    </div>
  );
};

export default CreateFormPage;
