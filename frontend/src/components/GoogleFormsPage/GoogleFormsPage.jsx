import React, { useState, useEffect } from "react";
import "./GoogleFormsPage.css";
import { v4 as uuidv4 } from "uuid";

const GoogleFormsPage = ({ currentUser }) => {
    const [forms, setForms] = useState([]);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showQuestionForm, setShowQuestionForm] = useState(false); // kontrola podforme
    const [questions, setQuestions] = useState([]); // lista vizuelno dodatih pitanja
    const [isSaving, setIsSaving] = useState(false); //Za pravilno čuvanje forme kasnije

    // Za novu formu
    const [formNaziv, setFormNaziv] = useState("");
    const [formOpis, setFormOpis] = useState("");
    const [allowAnonymous, setAllowAnonymous] = useState(false);

    // Funkcija za dodavanje pitanja - samo da vidim na šta liči
    const addQuestionVisual = () => {
        setQuestions(prev => [...prev, { text: "Novo pitanje" }]);
        setShowQuestionForm(false); // zatvara podformu
    };

    //Ovo je za load forma iz baze - Biće problem kada zaludi login, jer sesija istekne a ne vraća se na login stranu
    const loadForms = async () => {
        if(!currentUser?.id) return;
        try {
            const res = await fetch(`http://localhost/Baze_2/services/forms/getForms.php?userId=${currentUser.id}`);
            const data = await res.json();
            if(data.success){
                setForms(data.forms);
            }else {
                console.error("Imaš problem so učitanje na formite bratko: ", data.message);
                setForms([]);
            }
        } catch (err) {
            console.log("Greška sa fetchom: ", err);
            setForms([]);
        }
    };

    /* Simulacija učitavanja formi korisnika - isto da vidim na šta liči - Comment out dok testiram da li radi čitanje forme iz baze
    useEffect(() => {
        setForms([
            { 
                id: 1, 
                naziv: "Forma 1", 
                opis: "Kratki opis forme 1",
                thumbnail: null
            },
            { 
                id: 2, 
                naziv: "Forma 2", 
                opis: "Kratki opis forme 2",
                thumbnail: null
            },
            { 
                id: 3, 
                naziv: "Forma 3", 
                opis: "Kratki opis forme 2",
                thumbnail: null
            },
            { 
                id: 4, 
                naziv: "Forma 4", 
                opis: "Kratki opis forme 3",
                thumbnail: null
            }
        ]);
    }, []); */

    //Da učita kad se userPromeni
    useEffect(() => {
        loadForms();
    }, [currentUser]);

    const toggleCreateForm = () => setShowCreateForm(!showCreateForm);

    //BASIC Funkcija za unos forme u bazu - samo naziv, opis i allow checkbox
    const saveForm = async () => {
        if (isSaving) return;
        setIsSaving(true);
        const payload = {
            userId: currentUser.id, 
            naziv: formNaziv,
            opis: formOpis,
            allowAnonymous: allowAnonymous,
        };
        try {
            const res = await fetch("http://localhost/Baze_2/services/forms/createForm.php", {
                method: "POST",
                headers: {"Content-Type" : "application/json"},
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if(data.success) {
                alert("Forma uspešno kreirana!");
                await loadForms();
                //resetuješ polja zatvaraš formu, ne mogu se dodavati pitanja kada je forma već sačuvana linija pre loaduješ
                setFormNaziv("");
                setFormOpis("");
                setAllowAnonymous(false);
                setShowCreateForm(false);
                setQuestions([]);
                setShowQuestionForm(false);
            }
            else {
                alert("Greška: "+data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Ima neka greška brat moi sa server");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="google-forms-container">
            <header className="google-forms-header">
                <h2>Dobrodošao, {currentUser?.username || "Gost"}</h2>
            </header>

            <main className="google-forms-main">
                {/* Lista korisnikovih formi sa thumbnail karticama */}
                <h3>Moje forme</h3>
                {forms.length === 0 ? (
                    <p>Trenutno nemate ni jednu formu.</p>
                ) : (
                    <div className="form-list">
                        {forms.map(f => (
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
                <button type="button" onClick={toggleCreateForm}>+ Kreiraj novu formu</button>

                {/* Forma za kreiranje nove forme */}
                {showCreateForm && (
                    <div className="forms">
                        <h3>Nova forma</h3>

                        {/* Naziv forme */}
                        <div className="form-group">
                            <label>Naziv forme</label>
                            <input 
                                type="text" 
                                placeholder="Unesite naziv forme" 
                                value={formNaziv}
                                onChange={(e) => setFormNaziv(e.target.value)} 
                            />
                        </div>

                        {/* Opis forme */}
                        <div className="form-group">
                            <label>Opis</label>
                            <textarea 
                                placeholder="Unesite opis forme" 
                                value={formOpis}
                                onChange={(e) => setFormOpis(e.target.value)} 
                            />
                        </div>

                        {/* AllowAnonymous */}
                        <div className="form-group">
                            <label>
                                Dozvoli popunjavanje i neprijavljenim korisnicima
                                <input 
                                type="checkbox" 
                                checked={allowAnonymous}
                                onChange={(e) => setAllowAnonymous(e.target.checked)} 
                                />
                            </label>
                        </div>

                        {/* Dugme za dodavanje pitanja */}
                        {!showQuestionForm && (
                        <button type="button" onClick={() => setShowQuestionForm(true)}>
                            + Dodaj pitanje
                        </button>
                        )}

                        {/* Podforma za dodavanje pitanja */}
                        {showQuestionForm && (
                            <div className="question-form">
                                <h4>Dodaj pitanje</h4>

                                <div className="question-block">
                                <label>Kratko pitanje</label>
                                <input type="text" placeholder="Kratki odgovor" disabled />
                                </div>

                                <div className="question-block">
                                <label>Dug tekst</label>
                                <textarea placeholder="Dug tekst" disabled />
                                </div>

                                <div className="question-block">
                                <label>Jedan izbor</label>
                                <div>
                                    <input type="radio" disabled /> <label>Opcija 1</label>
                                </div>
                                <div>
                                    <input type="radio" disabled /> <label>Opcija 2</label>
                                </div>
                                </div>

                                <div className="question-block">
                                <label>Više izbora</label>
                                <div>
                                    <input type="checkbox" disabled /> <label>Opcija 1</label>
                                </div>
                                <div>
                                    <input type="checkbox" disabled /> <label>Opcija 2</label>
                                </div>
                                <div>
                                    <input type="checkbox" disabled /> <label>Opcija 3</label>
                                </div>
                                <input type="number" placeholder="Maksimalan broj izbora" disabled />
                                </div>

                                <div className="question-block">
                                <label>Numeričko pitanje</label>
                                <input type="number" placeholder="0 - 10, korak 2" disabled />
                                </div>

                                {/* Dugme za “dodaj pitanje” */}
                                <button type="button" onClick={addQuestionVisual}>
                                Dodaj pitanje
                                </button>
                            </div>
                        )}

                        {/* Lista pitanja u formi */}
                        {questions.length > 0 && (
                            <div className="question-list">
                                <h4>Lista pitanja</h4>
                                {questions.map((q, idx) => (
                                <div key={idx} className="question-block">
                                    <label>{q.text}</label>
                                </div>
                                ))}
                            </div>
                        )}
                        {/* Dugme sačuvaj formu */}
                        <button type="submit" onClick={saveForm} disabled={isSaving}>{isSaving ? "Čuvanje..." : "Sačuvaj formu"}</button>
                    </div>
                )}
                {/* Sekcija kolaboratora */}
                <h3>Kolaboratorske forme</h3>
                <p>Niste kolaborator ni na jednoj formi.</p>
            </main>
        </div>
    );
};

export default GoogleFormsPage;
