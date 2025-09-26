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
          <button className="btn-secondary" onClick={confirmQuestion}>Potvrdi pitanje</button>
        </div>
      )}

      {/* Lista pitanja */}
      {questions.length > 0 && (
        <div className="question-list">
          <h3>Lista pitanja</h3>
          {questions
            .sort((a, b) => a.Redosled - b.Redosled)
            .map(q => (
              <div key={q.id} className="question-item">
                {q.text} ({q.obavezno ? "Obavezno" : "Neobavezno"}) - {q.type}
                {q.options && q.options.length > 0 && (
                  <ul>{q.options.map((o,i) => <li key={i}>{o}</li>)}</ul>
                )}
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
