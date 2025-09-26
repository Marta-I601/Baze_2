import React, { useState, useEffect } from "react";
import "./AddQuestionsPage.css";

const questionTypes = [
  { value: "kratki_tekst", label: "Kratki tekst" },
  { value: "dugi_tekst", label: "Dugi tekst" },
  { value: "jedan_od_odabranih", label: "Jedan od ponuđenih" },
  { value: "vise_od_odabranih", label: "Više od ponuđenih" },
  { value: "numericki", label: "Numerički" },
  { value: "datum", label: "Datum" },
  { value: "vreme", label: "Vreme" },
];

const AddQuestionsPage = ({ formId, formData, onDone }) => {
  const [questions, setQuestions] = useState([]);
  const [showNewQuestion, setShowNewQuestion] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    text: "",
    type: "kratki_tekst",
    obavezno: false,
    options: [],
    minSelections: 0, 
    maxSelections: 0, 
  });
  const [optionText, setOptionText] = useState("");

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const res = await fetch(`http://localhost/Baze_2/services/forms/getQuestions.php?formId=${formId}`);
        const data = await res.json();
        if (data.success) {
          // Sortiranje pitanja po Redosled
          const sortedQuestions = data.questions.sort((a, b) => a.Redosled - b.Redosled);
          setQuestions(sortedQuestions);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadQuestions();
  }, [formId]);

  const addOption = () => {
    if (optionText.trim() === "") return;
    setNewQuestion(prev => ({ ...prev, options: [...prev.options, optionText.trim()] }));
    setOptionText("");
  };

  const confirmQuestion = async () => {
        if (!newQuestion.text) return alert("Unesite tekst pitanja");

        // Više od ponuđenih validacija minSelections
        if (newQuestion.type === "vise_od_odabranih") {
            if (newQuestion.requireMinSelections) {
                if (newQuestion.minSelections > newQuestion.options.length) {
                    return alert("Broj zahtevanih odgovora ne može biti veći od broja opcija!");
                }
                if (newQuestion.minSelections < 1) {
                    return alert("Mora se zahtevati bar 1 odgovor!");
                }
            }
            if (newQuestion.options.length < 2) {
                return alert("Dodajte bar 2 opcije za ovo pitanje!");
            }
        }

         // Jedan od ponuđenih bar 2 opcije
        if (newQuestion.type === "jedan_od_odabranih" && newQuestion.options.length < 2) {
            return alert("Dodajte bar 2 opcije za ovo pitanje!");
        }

         // Numerički tip validacije
        if (newQuestion.type === "numericki") {
            if (!newQuestion.numericType) {
                return alert("Izaberite tip numeričkog pitanja (lista ili skala)!");
            }
            if (newQuestion.numericType === "lista") {
                if (isNaN(newQuestion.start) || isNaN(newQuestion.end)) {
                    return alert("Unesite početni i krajnji broj!");
                }
                if (Number(newQuestion.end) < Number(newQuestion.start)) {
                    return alert("Krajnji broj mora biti veći ili jednak početnom!");
                }
            }

            if (newQuestion.numericType === "skala") {
                if (isNaN(newQuestion.start) || isNaN(newQuestion.end) || isNaN(newQuestion.step)) {
                    return alert("Unesite sve vrednosti skale!");
                }
                if (Number(newQuestion.step) <= 0) {
                    return alert("Korak (step) mora biti veći od 0!");
                }
                if (Number(newQuestion.end) < Number(newQuestion.start)) {
                    return alert("Krajnja vrednost mora biti veća ili jednaka početnoj!");
                }
            }
        }


        try {
            const bodyData = { 
            formId, 
            text: newQuestion.text, 
            type: newQuestion.type, 
            obavezno: newQuestion.obavezno, 
            options: newQuestion.options,
            redosled: questions.length + 1
            };

            if (newQuestion.type === "numericki") {
            bodyData.numericType = newQuestion.numericType;
            bodyData.start = newQuestion.start;
            bodyData.end = newQuestion.end;
            bodyData.step = newQuestion.step;
            }

            if (newQuestion.type === "vise_od_odabranih") {
                bodyData.requireMinSelections = newQuestion.requireMinSelections || false;
                if (newQuestion.requireMinSelections) {
                    bodyData.minSelections = newQuestion.minSelections;
                }
            }

            const res = await fetch("http://localhost/Baze_2/services/forms/createQuestion.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData),
            });

            const text = await res.text(); 
            console.log("RAW RESPONSE:", text); 
            const data = JSON.parse(text); 

            if (data.success) {
            setQuestions(prev => [...prev, { ...newQuestion, id: data.questionId, Redosled: questions.length + 1 }]);
            setNewQuestion({ text: "", type: "kratki_tekst", obavezno: false, options: [] });
            setOptionText("");
            setShowNewQuestion(false);
            } else {
            alert("Greška: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Greška sa serverom");
        }
    };


  //Izmenjeno - samo vraća na stranicu pitanja se jedno po jedno dodaju u bazu
  const saveAllQuestions = async () => {
    onDone();
  };

  //FUNKCIJA ZA KOPIRANJE PITANJA - NE IDE ODMA ISPOD ORIGINALA JER IM REDOSLED DAJEM PRI KREIRANJU
   const cloneQuestion = async (q) => {
        try {
        const bodyData = {
            formId,
            text: q.text,
            type: q.type,
            obavezno: q.obavezno,
            options: q.options || [],
            redosled: questions.length + 1,
        };

        if (q.type === "numericki") {
            bodyData.numericType = q.numericType;
            bodyData.start = q.start;
            bodyData.end = q.end;
            bodyData.step = q.step;
        }

        if (q.type === "vise_od_odabranih") {
            bodyData.requireMinSelections = q.requireMinSelections || false;
            if (q.requireMinSelections) {
            bodyData.minSelections = q.minSelections;
            }
        }

        const res = await fetch("http://localhost/Baze_2/services/forms/createQuestion.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData),
        });

        const text = await res.text();
        const data = JSON.parse(text);

        if (data.success) {
            setQuestions(prev => [...prev, { ...q, id: data.questionId, Redosled: questions.length + 1 }]);
        } else {
            alert("Greška prilikom kloniranja: " + data.message);
        }
        } catch (err) {
        console.error(err);
        alert("Greška sa serverom prilikom kloniranja pitanja");
        }
    };

    //FUNKCIJA ZA BRISANJE PITANJA
    const deleteQuestion = async (questionId) => {
        if (!window.confirm("Da li ste sigurni da želite da obrišete pitanje?")) return;

        try {
            const res = await fetch(`http://localhost/Baze_2/services/forms/deleteQuestion.php?id=${questionId}`, {
            method: "DELETE",
            });

            const data = await res.json();

            if (data.success) {
            // Ukloni pitanje iz lokalnog state-a
            setQuestions(prev => prev.filter(q => q.id !== questionId));
            } else {
            alert("Greška prilikom brisanja pitanja: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Greška sa serverom prilikom brisanja pitanja");
        }
    };

    //FUNKCIJA ZA IZMENU PITANJA - RADNA, NE MENJAJU SE OPCIJE PITANJA
    const [editingQuestion, setEditingQuestion] = useState(null);

    const startEditQuestion = (q) => {
    setEditingQuestion(q);
        setNewQuestion({
            text: q.text,
            type: q.type,
            obavezno: q.obavezno,
            options: q.options || [],
            numericType: q.numericType || null,
            start: q.start || "",
            end: q.end || "",
            step: q.step || "",
            requireMinSelections: q.requireMinSelections || false,
            minSelections: q.minSelections || 0,
        });
        setShowNewQuestion(true);
    };

    const confirmEditQuestion = async () => {
        try {
            const bodyData = {
            id: editingQuestion.id,
            text: newQuestion.text,
            type: newQuestion.type,
            obavezno: newQuestion.obavezno,
            options: newQuestion.options,
            redosled: editingQuestion.Redosled,
            };

            if (newQuestion.type === "numericki") {
            bodyData.numericType = newQuestion.numericType;
            bodyData.start = newQuestion.start;
            bodyData.end = newQuestion.end;
            bodyData.step = newQuestion.step;
            }

            if (newQuestion.type === "vise_od_odabranih") {
            bodyData.requireMinSelections = newQuestion.requireMinSelections || false;
            if (newQuestion.requireMinSelections) bodyData.minSelections = newQuestion.minSelections;
            }

            const res = await fetch("http://localhost/Baze_2/services/forms/updateQuestion.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bodyData),
            });

            const data = await res.json();

            if (data.success) {
            setQuestions(prev => prev.map(q => q.id === editingQuestion.id ? { ...q, ...newQuestion } : q));
            setEditingQuestion(null);
            setShowNewQuestion(false);
            setNewQuestion({ text: "", type: "kratki_tekst", obavezno: false, options: [] });
            } else {
            alert("Greška: " + data.message);
            }
        } catch (err) {
            console.error(err);
            alert("Greška sa serverom prilikom izmene pitanja");
        }
    };

    //FUNKCIJE ZA POMERANJE REDOSLEDA PITANJA
    const moveQuestionUp = async (index) => {
        if (index === 0) return; // prvo ne možeš više gore

        const newQuestions = [...questions];
        const current = newQuestions[index];
        const above = newQuestions[index - 1];

        // Menjanje redosleda
        const tempRedosled = current.Redosled;
        current.Redosled = above.Redosled;
        above.Redosled = tempRedosled;

        // Menjanje pitanja u nizu
        newQuestions[index - 1] = current;
        newQuestions[index] = above;

        setQuestions(newQuestions);

        // Čuvanje redosleda
        await updateQuestionOrder(current.id, current.Redosled);
        await updateQuestionOrder(above.id, above.Redosled);
    };

    const moveQuestionDown = async (index) => {
        if (index === questions.length - 1) return; // Poslednje pitanje ne možeš u zemlju

        const newQuestions = [...questions];
        const current = newQuestions[index];
        const below = newQuestions[index + 1];

        // Zamena redosled
        const tempRedosled = current.Redosled;
        current.Redosled = below.Redosled;
        below.Redosled = tempRedosled;

        // Zamena pitanja u nizu
        newQuestions[index + 1] = current;
        newQuestions[index] = below;

        setQuestions(newQuestions);

        await updateQuestionOrder(current.id, current.Redosled);
        await updateQuestionOrder(below.id, below.Redosled);
    };

    // Funkcija za update redosleda u bazi
    const updateQuestionOrder = async (questionId, redosled) => {
        try {
            const res = await fetch("http://localhost/Baze_2/services/forms/updateQuestion.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: questionId, redosled }),
            });
            const data = await res.json();
            if (!data.success) console.error("Greška pri promeni redosleda:", data.message);
        } catch (err) {
            console.error("Server error:", err);
        }
    };



  return (
    <div className="add-questions-container">
      <button className="close-btn" onClick={() => onDone()}>X</button>
      <h2>{formData.naziv}</h2>
      <p>{formData.opis}</p>
      <p>{formData.allowAnonymous ? "Dozvoljeno anonimno" : "Samo prijavljeni korisnici"}</p>

      {/* Forma za novo pitanje */}
      {showNewQuestion && (
        <div className="new-question-form">
          <input
            type="text"
            placeholder="Tekst pitanja"
            value={newQuestion.text}
            onChange={e => setNewQuestion({ ...newQuestion, text: e.target.value })}
          />
          <select
            value={newQuestion.type}
            onChange={e => setNewQuestion({ ...newQuestion, type: e.target.value, options: [] })}
          >
            {questionTypes.map(q => (
              <option key={q.value} value={q.value}>{q.label}</option>
            ))}
          </select>
          <label>
            <input
              type="checkbox"
              checked={newQuestion.obavezno}
              onChange={e => setNewQuestion({ ...newQuestion, obavezno: e.target.checked })}
            /> Obavezno
          </label>

          {newQuestion.type === "jedan_od_odabranih" && (
            <div className="options">
                <input
                    type="text"
                    placeholder="Nova opcija"
                    value={optionText}
                    onChange={e => setOptionText(e.target.value)}
                />
                <button onClick={addOption}>Dodaj opciju</button>
                <ul>
                    {newQuestion.options.map((opt, idx) => <li key={idx}>{opt}</li>)}
                </ul>
            </div>
           )}
           
          {newQuestion.type === "vise_od_odabranih" && (
            <div className="options">
                <input
                    type="text"
                    placeholder="Nova opcija"
                    value={optionText}
                    onChange={e => setOptionText(e.target.value)}
                />
                <button onClick={addOption}>Dodaj opciju</button>
                <ul>
                    {newQuestion.options.map((opt, idx) => <li key={idx}>{opt}</li>)}
                </ul>
                <div className="min-selections-option">
                    <label>
                        <input
                            type="radio"
                            name="requireMinSelections"
                            checked={!newQuestion.requireMinSelections}
                            onChange={() => setNewQuestion(prev => ({ ...prev, requireMinSelections: false, minSelections: 1 }))}
                        />
                        Minimun jedan odgovor
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="requireMinSelections"
                            checked={newQuestion.requireMinSelections}
                            onChange={() => setNewQuestion(prev => ({ ...prev, requireMinSelections: true }))}
                        />
                        Broj zahtevanih odgovora
                    </label>
                    {newQuestion.requireMinSelections && (
                        <div className="min-selections-input">
                            <label>
                                Broj zahtevanih odgovora:
                                <input
                                    type="number"
                                    min="1"
                                    max={newQuestion.options.length}
                                    value={newQuestion.minSelections || ""}
                                    onChange={e => {
                                        const val = parseInt(e.target.value);
                                        setNewQuestion(prev => ({
                                        ...prev,
                                        minSelections: isNaN(val) ? 0 : Math.min(val, prev.options.length)
                                        }));
                                    }}
                                />
                            </label>
                            <small>Ne može biti veće od broja opcija ({newQuestion.options.length})</small>
                        </div>
                    )}
                </div>
            </div>
          )}

          {newQuestion.type === "numericki" && (
            <div className="numeric-settings">
                <label>Izaberite tip numeričkog odgovora:</label>
                <div>
                    <label>
                        <input
                        type="radio"
                        name="numericType"
                        value="lista"
                        checked={newQuestion.numericType === "lista"}
                        onChange={() => setNewQuestion({ ...newQuestion, numericType: "lista" })}
                        />
                        Lista brojeva
                    </label>
                    <label>
                        <input
                        type="radio"
                        name="numericType"
                        value="skala"
                        checked={newQuestion.numericType === "skala"}
                        onChange={() => setNewQuestion({ ...newQuestion, numericType: "skala" })}
                        />
                        Skala
                    </label>
                </div>

                {newQuestion.numericType === "lista" && (
                    <div className="numeric-list">
                        <label>Početni broj:</label>
                        <input
                            type="number"
                            value={newQuestion.start || ""}
                            onChange={e => setNewQuestion({ ...newQuestion, start: e.target.value })}
                        />
                        <label>Krajnji broj:</label>
                        <input
                            type="number"
                            value={newQuestion.end || ""}
                            onChange={e => setNewQuestion({ ...newQuestion, end: e.target.value })}
                        />
                    </div>
                )}

                {newQuestion.numericType === "skala" && (
                    <div className="numeric-scale">
                        <label>Početni broj:</label>
                        <input
                            type="number"
                            value={newQuestion.start || ""}
                            onChange={e => setNewQuestion({ ...newQuestion, start: e.target.value })}
                        />
                        <label>Krajnji broj:</label>
                        <input
                            type="number"
                            value={newQuestion.end || ""}
                            onChange={e => setNewQuestion({ ...newQuestion, end: e.target.value })}
                        />
                        <label>Korak:</label>
                        <input
                            type="number"
                            value={newQuestion.step || ""}
                            onChange={e => setNewQuestion({ ...newQuestion, step: e.target.value })}
                        />
                    </div>
                )}
            </div>
          )}
          <button
            className="btn-secondary"
            onClick={editingQuestion ? confirmEditQuestion : confirmQuestion}
            >
            {editingQuestion ? "Sačuvaj izmene" : "Potvrdi pitanje"}
          </button>
        </div>
      )}

      {/* Lista pitanja */}
      {questions.length > 0 && (
        <div className="question-list">
          <h3>Lista pitanja</h3>
          {questions
            .sort((a, b) => a.Redosled - b.Redosled)
            .map((q,index) => (
              <div key={q.id} className="question-item">
                {q.text} ({q.obavezno ? "Obavezno" : "Neobavezno"}) - {q.type}
                {q.options && q.options.length > 0 && (
                  <ul>{q.options.map((o,i) => <li key={i}>{o}</li>)}</ul>
                )}
                {/* Dugmad za akcije */}
                <div className="question-actions">
                    <div className="question-actions">
                        <span title="Kloniraj" onClick={() => cloneQuestion(q)}>📄</span>
                        <span title="Izmeni" onClick={() => startEditQuestion(q)}>✏️</span>
                        <span title="Obriši" onClick={() => deleteQuestion(q.id)}>🗑️</span>
                        <span title="Pomeri gore" onClick={() => moveQuestionUp(index)}>⬆️</span>
                        <span title="Pomeri dole" onClick={() => moveQuestionDown(index)}>⬇️</span>
                    </div>
                </div>
            </div>
          ))}
        </div>
      )}
      <div className="buttons-row">
        {!showNewQuestion && (
            <button className="btn-primary green-btn" onClick={() => setShowNewQuestion(true)}>
                Dodaj pitanje
            </button>
        )}
        <button className="btn-primary blue-btn" onClick={saveAllQuestions}>
            Gotovo
        </button>
      </div>
    </div>
  );
};

export default AddQuestionsPage;
