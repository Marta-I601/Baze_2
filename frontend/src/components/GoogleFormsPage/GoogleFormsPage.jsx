import React, { useState, useEffect } from "react";
import CreateFormPage from "./CreateFormPage";
import AddQuestionsPage from "./AddQuestionsPage";
import "./GoogleFormsPage.css";

const GoogleFormsPage = ({ currentUser }) => {
  const [forms, setForms] = useState([]);
  const [filteredForms, setFilteredForms] = useState([]);
  const [page, setPage] = useState("home");
  const [activeFormId, setActiveFormId] = useState(null);
  const [activeFormData, setActiveFormData] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");  

  const loadForms = async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`http://localhost/Baze_2/services/forms/getForms.php?userId=${currentUser.id}`);
      const data = await res.json();
      if (data.success) {
        setForms(data.forms);
        setFilteredForms(data.forms);
      } else {
        setForms([]);
        setFilteredForms([]);
      }
    } catch (err) {
      console.error("Greška pri učitavanju formi: ", err);
      setForms([]);
    }
  };

  useEffect(() => {
    loadForms();
  }, [currentUser]);

  // Pretraga formi po nazivu
  useEffect(() => {
    if (!searchTerm) {
      setFilteredForms(forms);
    } else {
      const filtered = forms.filter(f => f.naziv.toLowerCase().includes(searchTerm.toLowerCase()));
      setFilteredForms(filtered);
    }
  }, [searchTerm, forms]);

  //Callback kada je forma kreirana
  const handleFormCreated = (formId, formData) => {
    setActiveFormId(formId);
    setActiveFormData(formData);
    setPage("addQuestions"); 
  };

  //Callback kada je dodavanje pitanja gotovo
  const handleQuestionsDone = () => {
    setActiveFormId(null);
    setActiveFormData(null);
    setPage("home");
    loadForms(); // refresh liste formi
  };

  if (page === "create") {
    return <CreateFormPage currentUser={currentUser} onFormCreated={handleFormCreated} />;
  }

  if (page === "addQuestions" && activeFormId && activeFormData) {
    return <AddQuestionsPage formId={activeFormId} formData={activeFormData} onDone={handleQuestionsDone} />;
  }

  return (
    <div className="google-forms-container">
      <header className="google-forms-header">
        <h2>Dobrodošao, {currentUser?.username || "Gost"}</h2>
      </header>

      <main className="google-forms-main">
        <div className="forms-header">
          <h3>Moje forme</h3>
          <input
            type="text"
            placeholder="Pretraži forme..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        {forms.length === 0 ? (
          <p>Trenutno nemate ni jednu formu.</p>
        ) : (
          <div className="form-list">
            {filteredForms.map(f => (
              <div key={f.id} className="form-card">
                <div className="form-thumbnail">
                  <div className="thumbnail-image">
                    <img src={f.thumbnail || "https://via.placeholder.com/200x100?text=Forma"} alt="Thumbnail" />
                  </div>
                  <div className="thumbnail-info">
                    <h4>{f.naziv}</h4>
                    <p>{f.opis}</p>
                  </div>
                </div>
                <div className="form-actions">
                  <button>Edit</button>
                  <button>Delete</button>
                  <button>Generiši link</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Dugme za kreiranje nove forme */}
        <button type="button" onClick={() => setPage("create")}>+ Kreiraj novu formu</button>

        {/* Sekcija kolaboratora */}
        <h3>Kolaboratorske forme</h3>
        <p>Niste kolaborator ni na jednoj formi.</p>
      </main>
    </div>
  );
};

export default GoogleFormsPage;
